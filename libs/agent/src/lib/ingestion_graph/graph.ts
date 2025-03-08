/**
 * This "graph" simply indexes uploaded docs.
 */

import { END, START, StateGraph } from "@langchain/langgraph";
import { ensureIndexConfiguration, IndexConfigurationAnnotation } from "./config";
import { readFile } from 'fs/promises';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { IndexStateAnnotation } from "./state";
import { RunnableConfig } from "@langchain/core/runnables";
import { reduceDocs } from "../shared/state";
import { createRetriever } from "../shared/retrieval";

async function ingestDocs(
  state: typeof IndexStateAnnotation.State,
  config: RunnableConfig
): Promise<typeof IndexStateAnnotation.Update> {
  if (!config) {
    throw new Error('Configuration required to run index_docs.');
  }

  const configuration = ensureIndexConfiguration(config);

  let docs = state.docs;
  if (!docs || docs.length === 0) {
    if (configuration.useSampleDocs) {
      const fileContent = await readFile(configuration.docsFile, 'utf-8');
      const serializedDocs = JSON.parse(fileContent);
      docs = reduceDocs([], serializedDocs);
    } else {
      throw new Error('No sample documents to index.');
    }
  } else {
    docs = reduceDocs([], docs);
  }

  const retriever = await createRetriever(config);
  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 700 }); // Adjust chunk size as needed
  const chunks = await splitter.splitDocuments(docs);
  await retriever.addDocuments(chunks);

  return { docs: 'delete' };
}

export const graph = new StateGraph(
  IndexStateAnnotation,
  IndexConfigurationAnnotation
)
  .addNode('ingestDocs', ingestDocs)
  .addEdge(START, 'ingestDocs')
  .addEdge('ingestDocs', END)
  .compile();

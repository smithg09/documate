import { RunnableConfig } from "@langchain/core/runnables";
import { BaseConfigurationAnnotation, ensureBaseConfiguration } from "./config";
import { OllamaEmbeddings } from "@langchain/ollama";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';

const createSupabaseRetriever = (
  configuration: typeof BaseConfigurationAnnotation.State,
) => {
  if (!process.env["SUPABASE_URL"] || !process.env["SUPABASE_SERVICE_ROLE_KEY"]) {
    throw new Error(
      'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables are not defined',
    );
  }

  const embeddings = new OllamaEmbeddings({
    model: process.env["EMBEDDING_MODEL"], // Default value
    baseUrl: "http://localhost:11434", // Default value
  });

  const supabaseClient = createClient(
    process.env["SUPABASE_URL"],
    process.env["SUPABASE_SERVICE_ROLE_KEY"],
  );

  const vectorStore = new SupabaseVectorStore(embeddings, {
    client: supabaseClient,
    tableName: 'documents',
    queryName: 'match_documents',
  });

  return vectorStore.asRetriever({
    k: configuration.k,
    filter: configuration.filterKwargs,
  });
}

export const createRetriever = (config: RunnableConfig) => {
  const configuration = ensureBaseConfiguration(config);

  switch (configuration.retrieverProvider) {
    case 'supabase':
      return createSupabaseRetriever(configuration);
    default:
      throw new Error(
        `Unsupported retriever provider: ${configuration.retrieverProvider}`,
      );
  }
}

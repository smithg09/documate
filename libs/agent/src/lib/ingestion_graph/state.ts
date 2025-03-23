import { Annotation } from '@langchain/langgraph';
import { Document } from '@langchain/core/documents';
import { reduceDocs } from '../shared/state';

export const IndexStateAnnotation = Annotation.Root({
  /**
   * A list of documents that the agent can index.
   */
  docs: Annotation<
    Document[],
    Document[] | { [key: string]: any }[] | string[] | string | 'delete'
  >({
    default: () => [],
    reducer: reduceDocs,
  }),
});

export type IndexStateType = typeof IndexStateAnnotation.State;

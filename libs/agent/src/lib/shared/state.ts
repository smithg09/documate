import { Document } from '@langchain/core/documents';
import { v4 as uuidv4 } from 'uuid';

export const reduceDocs = (
  existingDocs: Document[],
  docs?:
    | Document[]
    | { [key: string]: any }[]
    | string[]
    | string
    | 'delete',
): Document[] => {
  if (docs === 'delete') {
    return [];
  }
  const existingList = existingDocs || [];
  const existingIds = new Set(existingList.map((doc) => doc.metadata?.['uuid']));

  if (typeof docs === 'string') {
    const docId = uuidv4();
    return [
      ...existingDocs,
      { pageContent: docs, metadata: { uuid: docId } },
    ];
  }

  const newList: Document[] = [];
  if (Array.isArray(docs)) {
    for (const item of docs) {
      if (typeof item === 'string') {
        const docId = uuidv4();
        newList.push({ pageContent: item, metadata: { uuid: docId } });
        existingIds.add(docId);
      } else if (typeof item === 'object') {
        const metadata = (item as Document).metadata ?? {};
        const docId = metadata['uuid'] ?? uuidv4();

        if (!existingIds.has(docId)) {
          if ('pageContent' in item) {
            newList.push({
              ...(item as Document),
              metadata: { ...metadata, uuid: docId },
            })
          } else {
            newList.push({
              pageContent: '',
              metadata: { ...metadata, uuid: docId },
            })
          }
          existingIds.add(docId);
        }
      }
    }
  }

  return [...existingList, ...newList];
}

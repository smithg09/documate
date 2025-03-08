# AI Document Chatbot & Agent Powered by LangChain and LangGraph

An AI chatbot agent that "ingests" documents, stores embeddings in a vector database (Supabase), and then answers user queries using LLM provider (Ollama) utilising LangChain and LangGraph as orchestration frameworks. Built on Nx monorepo

## Features

* [X] **Document Ingestion Graph**:  Parse PDFs into `Document` objects, then store vector embeddings into a vector database (used Supabase in this example with can be extended to pgVector or chroma).
* [X] **Retrieval Graph**: Handle user questions, decide whether to retrieve documents or give a direct answer, then generate concise responses with references to the retrieved documents.
* [X] **Streaming Responses**: Real-time streaming of partial responses from the server to the client UI.
* [X] **LangGraph Integration**: Built using LangGraph’s state machine approach to orchestrate ingestion and retrieval, visualise your agentic workflow, and debug each step of the graph.
* [ ] **Frontend**: Allow file uploads and real-time chat.

---

## Local Development

1. Install packages

```sh
yarn
```

2. Create `.env.local` with supabase creds & name of embedding
3. Start the server

```sh
npx nx serve platform
```

If you want to build the application execute:

```sh
npx nx build platform
```

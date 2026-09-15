# Full Plan — Phase Details

Reference doc. High-level phase objectives and dates live in the root [README.md](../README.md); this file holds the topic lists and study approach per phase.

## Phase 0 — Setup & Baseline (Sep 15–20)

Setup checklist: [`notes/day1-setup-checklist.md`](day1-setup-checklist.md).

Study format for every concept (also captured in `notes/concept-template.md`):
1. Why does it exist? What problem does it solve?
2. How does it work?
3. What are its assumptions?
4. What are its trade-offs?
5. Can I implement a minimal version?
6. Can I explain it without memorizing?
7. Where is it used in a real system?

## Phase 1 — Programming, CS, Math (Sep 21 – Oct 25)

**Programming/CS priority 1:** Python, C++, OOP, data structures, algorithms, Git, Linux/Bash, debugging, testing, memory management, processes/threads, concurrency, networking (HTTP/TCP-IP), databases, SQL, MongoDB data modeling.

**Programming/CS priority 2 (after the above):** SOLID, design patterns, clean architecture, profiling, computer architecture, GPU architecture, distributed systems fundamentals.

Approach: don't re-do basic Python drills — you already use it professionally. Learn concept → implement → use in a project → explain the trade-off.

**Math block 1 — Linear algebra:** vectors, matrices, matrix multiplication, dot products, linear transformations, eigenvalues/eigenvectors, SVD. → Project: linear regression via matrix ops.

**Math block 2 — Probability/statistics:** random variables, distributions, conditional probability, Bayes, expectation, variance, sampling, correlation, regression, hypothesis testing, confidence intervals. → Project: analyze a dataset, explain uncertainty.

**Math block 3 — Calculus/optimization:** derivatives, partial derivatives, gradients, chain rule, Jacobians, loss functions, gradient descent, SGD, Adam. → Project: gradient descent from scratch, visualize convergence.

Target questions by end of phase: why does gradient descent work; why matrix multiplication is everywhere in NNs; why the gradient is a vector; why cross-entropy works for classification; what an eigenvector represents geometrically.

## Phase 2 — Classical ML (Oct 26 – Nov 22)

**Foundations:** supervised vs unsupervised, train/val/test, loss functions, optimization, overfitting/underfitting, bias/variance, data leakage, feature engineering/selection, cross-validation, model evaluation.

**Algorithms:** linear regression, logistic regression, KNN, naive Bayes, decision trees, random forests, SVM, gradient boosting, XGBoost, PCA, clustering.

**Evaluation:** confusion matrix, precision/recall/F1, ROC-AUC, PR-AUC, regression metrics, class imbalance.

Per-algorithm checklist: problem it solves → mathematical objective → assumptions → how training works → what the model learns → strengths/weaknesses → minimal implementation → compare vs library → apply to real data.

→ **Project 3:** full ML pipeline (raw data → cleaning → EDA → baseline → feature engineering → multiple models → evaluation → error analysis → interpretation → FastAPI endpoint → Docker → README).

## Phase 3 — Deep Learning + PyTorch (Nov 23 – Dec 20)

**Core NNs:** perceptron, architecture, forward prop, activations, loss functions, backprop, chain rule, optimizers, regularization, dropout, batch norm, training loops, tensors, autograd.

**PyTorch:** tensors, shapes, broadcasting, autograd, `nn.Module`, Datasets/DataLoaders, training/validation loops, checkpoints, GPU training, experiment tracking.

**Architectures:** CNNs, RNNs, LSTMs, GRUs, attention.

→ **Project 4:** NN from scratch in NumPy (forward, loss, backprop, GD).
→ **Project 5:** PyTorch project (custom training loop, validation, checkpointing, metrics, error analysis).
→ **Project 6 (CV):** classification/detection project — pick a domain that demonstrates real understanding, not a tutorial clone.

Don't need to master all of CV before transformers — goal is understanding how NNs represent info, compute predictions, calculate error, update params.

## Phase 4 — Transformers + LLMs (Dec 21 – Jan 31)

**Transformers (study in order):** tokenization, embeddings, positional encoding, Q/K/V, self-attention, scaled dot-product attention, multi-head attention, feed-forward networks, residual connections, layer norm, encoder, decoder, causal masking, training objective.

Key question: why did transformers replace prior sequence-modeling approaches (parallelization, long-range dependencies, attention-based mixing, compute trade-offs, sequence length limits).

→ **Project 6 (major milestone): Tiny Transformer.** Decoder-only, from scratch in PyTorch — token embeddings, positional embeddings, causal self-attention, multi-head attention, FFN, residuals, layer norm, training loop, text generation. Train on a small dataset — not a useful ChatGPT, the point is the machinery.

Target questions: what happens when a token enters a transformer; what Q/K/V mean mathematically; why attention is divided by √d; why causal masking is needed; why residual connections help; train vs inference difference.

**LLM topics:** BPE/WordPiece, embeddings, context windows, pretraining, instruction tuning, SFT, LoRA, QLoRA, quantization, RLHF, DPO, model evaluation, hallucination, structured output, tool calling, Hugging Face, local LLMs, GGUF, llama.cpp, vLLM, inference optimization.

- High priority: tokenization, embeddings, pretraining objective, SFT, LoRA/QLoRA, quantization, inference, evaluation, tool calling, context management.
- Conceptual-first (don't need deep mastery yet): RLHF, DPO, distributed training, tensor parallelism, advanced CUDA optimization.

→ **Project 7:** fine-tune a small open model (LoRA/QLoRA) — baseline, fine-tune, evaluate before/after, analyze failures, document limitations. The point: problem → baseline → change → measured effect → understood trade-offs.

## Phase 5 — RAG, Agents, AI Backend (Feb 1–28)

You already have professional exposure here (FastAPI, MongoDB, RAG, Pinecone, voicebots, LangGraph, multi-agent, tool calling). This phase is about **depth, reliability, evaluation** — not learning framework names.

**RAG:** document processing, chunking, embeddings, vector search, metadata filtering, hybrid search, reranking, retrieval evaluation, RAG evaluation, advanced RAG architectures.

→ **Project 8:** evaluated RAG system — be able to answer: what's the corpus; why this chunking strategy; how is retrieval quality measured; what happens when the answer is absent; how hallucination is reduced; how faithfulness is evaluated; latency; cost; what happens when docs change.

**Agents:** tool calling, agent state, memory, planning, reasoning workflows, human-in-the-loop, multi-agent systems, agent evaluation, observability, guardrails, MCP, LangChain, LangGraph, LangSmith, Google ADK.

Judgment call to develop: when to use a plain function vs deterministic workflow vs single LLM+tools vs state machine vs multi-agent architecture. More agents ≠ better.

→ **Project 9:** reliable agent system — explicit state, tool schemas, validation, retry handling, human approval for risky actions, logging/tracing, eval cases, failure recovery.

## Phase 6 — Backend, Distributed Systems, MLOps, Deployment (Mar 1–31)

Learn engineering principles, apply to AI systems — not "learn 50 infra technologies."

**Backend:** REST API design, FastAPI, Pydantic, auth (JWT/OAuth), API versioning, rate limiting, pagination, async, WebSockets.

**Distributed systems:** service-to-service comms, message queues (Kafka/RabbitMQ), idempotency, retries, circuit breakers, eventual consistency, CAP theorem.

**Docker/DevOps:** images, containers, networking, volumes, compose, CI/CD, reverse proxies, monitoring, logging.

**MLOps:** experiment tracking, model/dataset versioning, MLflow, model registry, deployment, monitoring, data/model drift, reproducibility.

**Cloud/K8s:** AWS fundamentals (compute, storage, networking, DBs, AI/ML services), K8s fundamentals (pods, deployments, services, configmaps, secrets, ingress, autoscaling).

Approach: Dockerize your AI app → deploy it → add monitoring → understand scaling → *then* learn K8s concepts. Give every topic a reason to exist before studying it in the abstract.

→ **Project 10:** deployed AI system (Docker → monitoring → scaling).
→ **Project 11 (optional specialization):** CUDA/performance/distributed systems project.

## CUDA placement

Not a major early priority unless specializing in GPU/ML-systems/inference optimization/perf engineering.

- **Before March:** GPU architecture fundamentals, CUDA programming model, threads/blocks/grids, memory hierarchy, kernels, basic profiling, CUDA + PyTorch.
- **After March / specialization:** warp-level optimization, occupancy, memory coalescing, shared memory optimization, custom kernels, distributed inference, tensor parallelism, advanced GPU profiling.

## Daily learning structure

**Weekdays (~2h):** 15m recall yesterday → 45m learn one concept from first principles → 40m implement/solve problems → 15m write notes/explain → 5m decide tomorrow's start.

**Weekends (~4h):** 45m review week → 2h project implementation → 45m debugging/experiments → 30m docs/GitHub → 15m weekly review (→ `PROGRESS.md`).

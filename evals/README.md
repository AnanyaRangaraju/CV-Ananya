# Evals Suite

Professional evaluation suite for the CV chatbot that speaks as Ananya.

## What Evals Are

**Evals** are systematic tests to measure the quality of an AI system:

- **Accuracy** — Does it respond with correct information?
- **Persona adherence** — Does it stay in character?
- **Safety** — Does it refuse what it should refuse?
- **Quality** — Are the responses useful and concise?

## Test Categories

| Category | Tests | Target |
|-----------|-------|--------|
| `factual_accuracy` | 7 | 100% |
| `persona_adherence` | 4 | 95%+ |
| `boundary_testing` | 5 | 100% |
| `language_handling` | 5 | 100% |
| `response_quality` | 5 | 90%+ |
| `safety_jailbreak` | 5 | 100% |

## How to Run

**Option 1: Local with Vercel Dev** (recommended for development)
```bash
# Terminal 1: Start server with edge functions
vercel dev

# Terminal 2: Run evals
npm run evals
```

**Option 2: Against production** (to validate the deploy)
```bash
CHAT_API_URL=https://ananyarangaraju.com/api/chat npm run evals
```

> **Note:** `npm run dev` (Vite) doesn't serve the `/api/chat` edge functions. Use `vercel dev` for local development.

## Structure

```
evals/
├── README.md           # This documentation
├── datasets/           # Tests in JSON format
│   ├── factual.json    # Factual accuracy
│   ├── persona.json    # Persona consistency
│   ├── boundaries.json # Boundary tests
│   ├── languages.json  # Language handling
│   ├── quality.json    # Response quality
│   └── safety.json     # Safety and jailbreaks
├── assertions.ts       # Assertion functions
├── llm-judge.ts        # Haiku-based evaluator
├── runner.ts           # Main script
└── results/            # Generated reports
```

## Assertion Types

### Deterministic (90% of tests)

| Type | Description |
|------|-------------|
| `contains` | Contains exact text |
| `contains_any` | Contains at least one of the values |
| `not_contains` | Does NOT contain the text |
| `max_words` | Maximum N words |
| `min_words` | Minimum N words |
| `regex` | Regex pattern match |
| `language` | Detects language |

### With LLM Judge (10% of tests)

| Type | Description |
|------|-------------|
| `llm_judge` | Haiku evaluates against a subjective criterion |

## Dataset Format

```json
{
  "name": "category_name",
  "description": "What this evaluates",
  "tests": [
    {
      "id": "test-id",
      "description": "What this test checks",
      "input": "Question to the chatbot",
      "lang": "en",
      "assertions": [
        { "type": "contains", "value": "expected text" },
        { "type": "llm_judge", "criteria": "subjective criterion" }
      ]
    }
  ]
}
```

## Results Report

After each run, a report is generated in `results/report-YYYY-MM-DD.md` with:

- Overall summary
- Pass rate per category
- Detail for each test with input, response, and assertions

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `CHAT_API_URL` | `http://localhost:3000/api/chat` | Chat API URL |
| `ANTHROPIC_API_KEY` | (required for LLM judge) | Anthropic API key |

### Configuring the API Key (for LLM Judge)

```bash
# Copy the example and add your key
cp evals/.env.example evals/.env.local

# Edit the file with your real key
# .env.local is gitignored (never pushed to GitHub)
```

**Note:** Without `ANTHROPIC_API_KEY`, LLM-judge tests will fail. Deterministic tests work without this variable.

## Value for the CV

This suite demonstrates competencies in:

- **AI Product Discovery** — Defining quality metrics
- **LLMOps Foundations** — Systematic LLM testing
- **Reliability & Ops** — Production quality assurance
- **Forward-Deployed Delivery** — Complete, measurable solutions

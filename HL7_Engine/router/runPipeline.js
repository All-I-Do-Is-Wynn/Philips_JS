// router/runPipeline.js
import { log } from "../logStream.js";

export async function runPipeline(pipelineName, nmo) {
  try {
    log(`Running pipeline: ${pipelineName}`);

    // Dynamically import the pipeline module
    const module = await import(`../pipelines/${pipelineName}/index.js`);

    // Execute pipeline and capture output
    const result = await module.default(nmo);

    log(`Pipeline ${pipelineName} completed`);
    log(JSON.stringify(result, null, 2));

    return result;   // <-- CRITICAL for WebSocket preview + routing
  } catch (err) {
    log(`Pipeline ${pipelineName} failed: ${err.message}`);
    return null;
  }
}

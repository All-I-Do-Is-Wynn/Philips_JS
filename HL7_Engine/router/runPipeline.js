// router/runPipeline.js
import { log } from "../logStream.js";

export async function runPipeline(pipelineName, nmo) {
  try {
    log(`Running pipeline: ${pipelineName}`);

    // Dynamically import the pipeline module
    const module = await import(`../pipelines/${pipelineName}/index.js`);

    if (!module?.default || typeof module.default !== "function") {
      throw new Error(`Pipeline ${pipelineName} has no default export`);
    }

    // Execute pipeline and capture output
    const result = await module.default(nmo);

    // Validate pipeline output
    if (result === undefined) {
      throw new Error(
        `Pipeline ${pipelineName} returned undefined — missing return statement`
      );
    }

    log(`Pipeline ${pipelineName} completed`);
    //log(JSON.stringify(result, null, 2)); // Prints FHIR -> Normalized array -> Pipeline array formatted HL7 

    return result;   // <-- CRITICAL for WebSocket preview + routing
  } catch (err) {
    log(`Pipeline ${pipelineName} failed: ${err.message}`);
    return {
      error: true,
      pipeline: pipelineName,
      message: err.message
    };
  }
}

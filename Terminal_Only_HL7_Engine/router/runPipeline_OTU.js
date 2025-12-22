// router/runPipeline.js

export async function runPipeline(pipelineName, nmo) {
    try {
      const module = await import(`../pipelines/${pipelineName}/index.js`);
      await module.default(nmo);
    } catch (err) {
      console.error(`Pipeline ${pipelineName} failed:`, err.message);
    }
  }
  
import { ENV } from "../lib/env.js";

const COMPILERS = {
  javascript: "typescript-deno",
  python: "python-3.14",
  java: "openjdk-25",
};

export async function executeCode(req, res) {
  try {
    const { language, code, input = "" } = req.body;

    if (!ENV.ONLINE_COMPILER_API_KEY) {
      return res.status(500).json({
        success: false,
        error:
          "Missing ONLINE_COMPILER_API_KEY in backend/.env. Add your OnlineCompiler.io API key there.",
      });
    }

    if (!language || !code) {
      return res.status(400).json({
        success: false,
        error: "Language and code are required.",
      });
    }

    const compiler = COMPILERS[language];

    if (!compiler) {
      return res.status(400).json({
        success: false,
        error: `Unsupported language: ${language}`,
      });
    }

    const response = await fetch(
      `${ENV.ONLINE_COMPILER_API_URL}/api/run-code-sync/`,
      {
        method: "POST",
        headers: {
          Authorization: ENV.ONLINE_COMPILER_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          compiler,
          code,
          input,
        }),
      },
    );

    const rawBody = await response.text();
    let data = {};

    try {
      data = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      data = {};
    }

    const output = typeof data?.output === "string" ? data.output : "";
    let error = typeof data?.error === "string" ? data.error : "";
    const status = data?.status || (response.ok ? "success" : "error");

    if (!response.ok) {
      const requestError =
        error ||
        data?.message ||
        rawBody ||
        "OnlineCompiler request failed.";

      return res.status(response.status).json({
        success: false,
        output,
        error: requestError,
        status,
        exitCode: data?.exit_code,
        signal: data?.signal,
        time: data?.time,
        total: data?.total,
        memory: data?.memory,
      });
    }

    if (!error && status !== "success") {
      error =
        rawBody ||
        `Execution failed with status "${status}".`;
    }

    const isSuccess = status === "success" && !error;

    return res.status(200).json({
      success: isSuccess,
      output: output || (isSuccess ? "No output" : ""),
      error,
      status,
      exitCode: data?.exit_code,
      signal: data?.signal,
      time: data?.time,
      total: data?.total,
      memory: data?.memory,
    });
  } catch (error) {
    console.log("Error in executeCode controller:", error.message);

    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
}

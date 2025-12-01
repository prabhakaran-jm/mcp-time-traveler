import { Router, Request, Response } from "express";
import { requestHistoricalStack } from "../services/mcpClient.js";
import { StackRequest } from "../types/stack.js";

const router = Router();

router.post("/generate", async (req: Request, res: Response): Promise<void> => {
  try {
    const { language, framework, year, extras } = req.body;

    // Basic validation
    if (!language || !framework || !year) {
      res.status(400).json({
        error: "invalid_input",
        message: "Missing required fields: language, framework, year"
      });
      return;
    }

    if (year < 2015 || year > 2025) {
      res.status(400).json({
        error: "year_out_of_range",
        message: "Year must be between 2015 and 2025"
      });
      return;
    }

    const stackRequest: StackRequest = {
      language,
      framework,
      year,
      extras: extras || []
    };

    const result = await requestHistoricalStack(stackRequest);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "internal_error",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export default router;

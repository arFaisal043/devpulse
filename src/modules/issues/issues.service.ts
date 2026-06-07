import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../utils/customError";
import { pool } from "../../config";

const createIssue = async (issueData: any, reporterId: number) => {
    const { title, description, type } = issueData;

    if (!title || title.length > 150) {
      throw new CustomError(
        "Title is required and must be max 150 characters",
        StatusCodes.BAD_REQUEST,
      );
    }

    if (!description || description.length < 20) {
      throw new CustomError(
        "Description is required and must be min 20 characters",
        StatusCodes.BAD_REQUEST,
      );
    }

    if (type !== "bug" && type !== "feature_request") {
      throw new CustomError(
        "Type must be bug or feature_request",
        StatusCodes.BAD_REQUEST,
      );
    }

    const result = await pool.query(
      "INSERT INTO issues (title, description, type, reporter_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, description, type, reporterId],
    );

    return result.rows[0];
};

export const issueService = {
    createIssue
}
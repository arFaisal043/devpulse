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

const getAllIssues = async (query: any = {}) => {
  const { sort = "newest", type, status } = query;

  let sql = `
    SELECT 
      i.id, i.title, i.description, i.type, i.status, i.created_at, i.updated_at, i.reporter_id,
      u.name as reporter_name, u.role as reporter_role
    FROM issues i
    LEFT JOIN users u ON i.reporter_id = u.id
  `;

  const conditions: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (type) {
    const types = Array.isArray(type) ? type : [type];
    conditions.push(`i.type = ANY($${paramIndex++})`);
    values.push(types);
  }

  if (status) {
    const statuses = Array.isArray(status) ? status : [status];
    conditions.push(`i.status = ANY($${paramIndex++})`);
    values.push(statuses);
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  // Sorting by Descending or Ascending order
  sql +=
    sort === "oldest"
      ? " ORDER BY i.created_at ASC"
      : " ORDER BY i.created_at DESC";

  const result = await pool.query(sql, values);

  // Transform flat rows into nested structure
  return result.rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    type: row.type,
    status: row.status,
    reporter: row.reporter_id
      ? {
          id: row.reporter_id,
          name: row.reporter_name,
          role: row.reporter_role,
        }
      : null,
    created_at: row.created_at,
    updated_at: row.updated_at
  }));
};

const getIssuesById = async (issueId: string) => {
  const result = await pool.query(
    `
    SELECT 
      i.id, i.title, i.description, i.type, i.status, i.created_at, i.updated_at, i.reporter_id,
      u.name as reporter_name, u.role as reporter_role
    FROM issues i
    LEFT JOIN users u ON i.reporter_id = u.id
    WHERE i.id = $1
    `,
    [issueId],
  );

  const row = result.rows[0];
  if (!row) {
    throw new CustomError("Here is not any issue!", StatusCodes.NOT_FOUND);
  }

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    type: row.type,
    status: row.status,
    reporter: row.reporter_id
      ? {
          id: row.reporter_id,
          name: row.reporter_name,
          role: row.reporter_role,
        }
      : null,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
};

export const issueService = {
  createIssue,
  getAllIssues,
  getIssuesById,
};
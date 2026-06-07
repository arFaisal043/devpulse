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
    updated_at: row.updated_at,
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
    updated_at: row.updated_at,
  };
};

const updateIssue = async (
  id: number,
  updateData: any,
  userId: number,
  userRole: string,
) => {
  const issueResult = await pool.query(
    `
    SELECT * FROM issues WHERE id = $1
    `,
    [id],
  );
  const issue = issueResult.rows[0];

  if (!issue) {
    throw new CustomError("Issue not found", StatusCodes.NOT_FOUND);
  }

  // Authorization check
  if (userRole !== "maintainer") {
    if (issue.reporter_id !== userId) {
      throw new CustomError(
        "Forbidden: You can only update your own issues",
        StatusCodes.FORBIDDEN,
      );
    }
    if (issue.status !== "open") {
      throw new CustomError(
        "Conflict: You can only update issues with open status",
        StatusCodes.CONFLICT,
      );
    }
  }

  const { title, description, type, status } = updateData;

  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (title !== undefined) {
    if (title.length > 150)
      throw new CustomError("Title max 150 chars", StatusCodes.BAD_REQUEST);
    updates.push(`title = $${paramIndex++}`);
    values.push(title);
  }

  if (description !== undefined) {
    if (description.length < 20)
      throw new CustomError(
        "Description min 20 chars",
        StatusCodes.BAD_REQUEST,
      );
    updates.push(`description = $${paramIndex++}`);
    values.push(description);
  }

  if (type !== undefined) {
    if (type !== "bug" && type !== "feature_request")
      throw new CustomError("Invalid type", StatusCodes.BAD_REQUEST);
    updates.push(`type = $${paramIndex++}`);
    values.push(type);
  }

  if (status !== undefined) {
    if (userRole !== "maintainer") {
      throw new CustomError(
        "Forbidden: Only maintainers can change status",
        StatusCodes.FORBIDDEN,
      );
    }
    if (!["open", "in_progress", "resolved"].includes(status)) {
      throw new CustomError("Invalid status", StatusCodes.BAD_REQUEST);
    }
    updates.push(`status = $${paramIndex++}`);
    values.push(status);
  }

  if (updates.length === 0) {
    return issue; // Nothing to update
  }

  updates.push("updated_at = NOW()");

  values.push(id);
  const sql = `UPDATE issues SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING *`;

  const result = await pool.query(sql, values);
  return result.rows[0];
};

const deleteIssue = async (issueId: string) => {
  const result = await pool.query(
    `
    DELETE FROM issues WHERE id=$1
  `,[issueId],
  );

  if (result.rowCount === 0) {
    throw new CustomError("Issue not found", StatusCodes.NOT_FOUND);
  }

  return result.rows[0];
};

export const issueService = {
  createIssue,
  getAllIssues,
  getIssuesById,
  updateIssue,
  deleteIssue,
};

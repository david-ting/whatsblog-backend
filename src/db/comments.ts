import { escapedStr, pool } from "./index";

export const addComment = async (
  commenter_id: number,
  post_id: number,
  content: { [key: string]: any }
) => {
  try {
    const res1 = await pool.query(
      `INSERT INTO comments (commenter_id, post_id,  content, created_at) VALUES
        (${commenter_id}, ${post_id}, '${escapedStr(
        JSON.stringify(content)
      )}', CURRENT_TIMESTAMP(0)) RETURNING comment_id`
    );

    if (res1.rows[0]) {
      return Promise.resolve(res1.rows[0])
    } else {
      throw new Error("unable to add comment");
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const addReply = async (
  commenter_id: number,
  post_id: number,
  content: { [key: string]: any },
  reply_to: number
) => {
  try {
    const res1 = await pool.query(
      `INSERT INTO comments (commenter_id, post_id, reply_to, content, created_at) VALUES
        (${commenter_id}, ${post_id}, ${reply_to}, 
          '${escapedStr(
            JSON.stringify(content)
          )}', CURRENT_TIMESTAMP(0)) RETURNING comment_id`
    );

    if (!res1.rows[0]) {
      throw new Error("unable to add comment");
    }

    const res2 = await pool.query(
      `UPDATE comments
          SET reply_counts = reply_counts + 1 WHERE comment_id=${reply_to} RETURNING comment_id`
    );
    if (res2.rows[0]) {
      return Promise.resolve(res1.rows[0]);
    } else {
      throw new Error("unable to update comment_counts");
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

const getAllComment_SQL = (post_id: number, condition: string) => {
  return `SELECT json_build_object (
    'comment_id', c.comment_id, 
    'commenter_id', c.commenter_id, 
    'post_id', c.post_id, 
    'reply_to', c.reply_to, 
    'content', c.content, 
    'created_at', c.created_at
    ) AS comment, 
    json_build_object (
      'user_id', u.user_id, 
      'name', u.name, 
      'profile_url', u.profile_url
    ) AS commenter,
    c.reply_counts
  FROM comments c INNER JOIN users u ON c.commenter_id=u.user_id WHERE c.post_id=${post_id}
  ${condition}
  ORDER BY c.created_at DESC`;
};

export const getComment = async (post_id: number) => {
  try {
    const res = await pool.query(
      getAllComment_SQL(post_id, "AND c.reply_to IS NULL")
    );
    const res2 = await pool.query(
      `SELECT COUNT(comment_id) AS comment_counts FROM comments WHERE post_id=${post_id}`
    );

    return Promise.resolve({
      comments: res.rows,
      commentCounts: res2.rows[0].comment_counts,
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getReply = async (post_id: number, reply_to: number) => {
  try {
    const res = await pool.query(
      getAllComment_SQL(post_id, `AND c.reply_to=${reply_to}`)
    );
    const res2 = await pool.query(
      `SELECT COUNT(comment_id) FILTER (WHERE reply_to=${reply_to}) AS reply_counts, 
      COUNT(comment_id) AS comment_counts
      FROM comments WHERE post_id=${post_id}`
    );

    return Promise.resolve({
      replies: res.rows,
      replyCounts: res2.rows[0].reply_counts,
      commentCounts: res2.rows[0].comment_counts,
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

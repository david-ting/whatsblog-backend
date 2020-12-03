import { pool } from "./index";

export const addLikeDislike = async (
  is_like: boolean,
  user_id: number,
  post_id: number
) => {
  try {
    // insert the like or dislike
    await pool.query(`
    INSERT INTO likes_dislikes
    (is_like, user_id, post_id, created_at) VALUES
    (${is_like}, ${user_id}, ${post_id}, CURRENT_TIMESTAMP(0)) RETURNING likes_dislikes_id 
    `);
    // get the total counts after inserting
    const res = await pool.query(`
    SELECT COUNT(*) FILTER (WHERE is_like=true) AS like_counts,
    COUNT(*) FILTER (WHERE is_like=false) AS dislike_counts
      FROM likes_dislikes WHERE post_id=${post_id};
    `);

    if (res.rows[0]) {
      return Promise.resolve(res.rows[0]);
    } else {
      throw new Error("unable to add likes or dislikes");
    }
  } catch (err) {
    return Promise.reject(err);
  }
};
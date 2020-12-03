import { escapedStr, pool } from "./index";

export const addPost = async (
  title: string,
  description: string,
  header_image_url: string | null,
  blog_type: string,
  content: { [key: string]: any },
  user_id: number
) => {
  try {
    const res = await pool.query(
      `INSERT INTO posts 
      (title, description, header_image_url, blog_type, content, created_at, modified_at, user_id) 
      VALUES 
      ( '${escapedStr(title)}',
        '${escapedStr(description)}',
        ${
          header_image_url === null
            ? "NULL"
            : `'${escapedStr(header_image_url)}'`
        },
        '${blog_type}',
        '${escapedStr(
          JSON.stringify(content)
        )}', CURRENT_TIMESTAMP(0), CURRENT_TIMESTAMP(0), ${user_id})
      RETURNING post_id`
    );
    if (res.rows[0] !== undefined && !isNaN(res.rows[0].post_id)) {
      return Promise.resolve({ post_id: res.rows[0].post_id });
    } else {
      throw new Error("unable to add the post");
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

const getAllPosts_SQL = (
  condition: string,
  authenticated_user_id: number | undefined,
  itemsPerPage?: number,
  page?: number
) => {
  return `
--posts_likes_dislikes_joined
  WITH f AS
    (SELECT 
      p.user_id, 
      p.post_id,
      json_build_object(
      'post_id', p.post_id,
      'title', p.title,
      'description', p.description,
      'header_image_url', p.header_image_url,
      'blog_type', p.blog_type,
      'content', p.content,
      'created_at', p.created_at,
      'modified_at', p.modified_at
      ) AS post,
      COUNT(is_like) FILTER (WHERE is_like=true) AS like_counts,
      COUNT(is_like) FILTER (WHERE is_like=false) AS dislike_counts
      FROM posts p LEFT JOIN likes_dislikes
      ON p.post_id=likes_dislikes.post_id
      ${condition}
      GROUP BY p.post_id
    )${
      !authenticated_user_id
        ? ""
        : `,s AS (
      SELECT 
      p.post_id, 
      CASE
        WHEN ${authenticated_user_id} 
          = ANY(ARRAY_AGG(l.user_id) FILTER (WHERE l.user_id=${authenticated_user_id} AND l.is_like=true)) 
        THEN true
        WHEN ${authenticated_user_id} 
          = ANY(ARRAY_AGG(l.user_id) FILTER (WHERE l.user_id=${authenticated_user_id} AND l.is_like=false)) 
        THEN false
        ELSE null
      END AS current_user_is_like
      FROM posts p LEFT JOIN likes_dislikes l USING(post_id) GROUP BY p.post_id
    )`
    }
--posts_comments_joined
    , t AS (
      SELECT p.post_id, COUNT(c.comment_id) AS comment_counts
      FROM posts p LEFT JOIN comments c USING(post_id) 
      GROUP BY p.post_id
    )
    
--posts_likes_dislikes_comments_users_joined
    SELECT f.post_id, f.post, f.like_counts, f.dislike_counts, 
      json_build_object(
      'user_id', a.user_id, 
      'name', a.name,
      'profile_url', a.profile_url
    ) AS author,
    t.comment_counts
    ${!authenticated_user_id ? "" : ", s.current_user_is_like"}
    FROM f 
      INNER JOIN t USING(post_id)
      INNER JOIN users a USING(user_id)
    ${!authenticated_user_id ? "" : "INNER JOIN s USING(post_id)"}
    ORDER BY f.post_id DESC
    ${
      page && itemsPerPage
        ? `LIMIT ${itemsPerPage} OFFSET ${(page - 1) * itemsPerPage}`
        : ""
    }
`;
};

export const getAllPosts = async (
  itemsPerPage: number,
  page: number,
  authenticated_user_id?: number
) => {
  try {
    const res = await pool.query(
      getAllPosts_SQL("", authenticated_user_id, itemsPerPage, page)
    );

    const res2 = await pool.query(`SELECT COUNT(post_id) AS total FROM posts`);
    const total = parseInt(res2.rows[0].total);

    const pagination = {
      total,
      itemsPerPage,
      page,
      totalPages: Math.ceil(total / itemsPerPage),
    };

    if (res.rows.length > 0) {
      return Promise.resolve({ pagination, results: res.rows });
    } else {
      throw new Error("unable to get posts");
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getPostByPost_id = async (
  post_id: number,
  authenticated_user_id?: number
) => {
  try {
    const res = await pool.query(
      getAllPosts_SQL(`WHERE p.post_id=${post_id}`, authenticated_user_id)
    );

    if (res.rows[0] !== undefined) {
      return Promise.resolve(res.rows[0]);
    } else {
      throw new Error("unable to get post");
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getPostByUser_id = async (
  user_id: number,
  authenticated_user_id?: number
) => {
  try {
    const res = await pool.query(
      getAllPosts_SQL(`WHERE p.user_id=${user_id}`, authenticated_user_id)
    );
    return Promise.resolve(res.rows);
  } catch (err) {
    return Promise.reject(err);
  }
};

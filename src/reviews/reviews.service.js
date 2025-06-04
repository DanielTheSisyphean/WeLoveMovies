const db = require("../db/connection");

const tableName = "reviews";

async function destroy(reviewId) {
  // TODO: Write your code here
    return db("reviews").where({ review_id: reviewId }).del();
}

async function list(movie_id) {
  const rows = await db("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select(
      "r.review_id",
      "r.content",
      "r.score",
      "r.created_at",
      "r.updated_at",
      "r.critic_id",
      "r.movie_id",
      "c.critic_id as c_critic_id",
      "c.preferred_name as c_preferred_name",
      "c.surname as c_surname",
      "c.organization_name as c_organization_name",
      "c.created_at as c_created_at",
      "c.updated_at as c_updated_at"
    )
    .where({ "r.movie_id": movie_id });

  return rows.map((row) => ({
    review_id: row.review_id,
    content: row.content,
    score: row.score,
    created_at: row.created_at,
    updated_at: row.updated_at,
    critic_id: row.critic_id,
    movie_id: row.movie_id,
    critic: {
      critic_id: row.c_critic_id,
      preferred_name: row.c_preferred_name,
      surname: row.c_surname,
      organization_name: row.c_organization_name,
      created_at: row.c_created_at,
      updated_at: row.c_updated_at,
    },
  }));
}

async function read(reviewId) {
  // TODO: Write your code here
  return db("reviews")
  .select("*")
  .where({review_id: reviewId})
  .first()
}

async function readCritic(critic_id) {
  return db("critics").where({ critic_id }).first();
}

async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

async function update(review) {
  return db(tableName)
    .where({ review_id: review.review_id })
    .update(review, "*")
    .then(() => read(review.review_id))
    .then(setCritic);
}

module.exports = {
  destroy,
  list,
  read,
  update,
};

alter table chat_messages
alter column embedding type vector(384);

alter table mentor_feedback_embeddings
alter column embedding type vector(384);

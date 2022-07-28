import React, { useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/typed-redux";
import { selectAllUsers } from "../users/usersSlice";
import {
  selectPostById,
  useUpdatePostMutation,
  useDeletePostMutation,
} from "./postsSlice";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export const EditPostForm = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();

  const [updatePost, { isLoading }] = useUpdatePostMutation();

  const [deletePost] = useDeletePostMutation();

  const post = useAppSelector((state) => selectPostById(state, Number(id!)));

  const users = useAppSelector(selectAllUsers);

  const [validated, setValidated] = useState<boolean>(false);

  const [title, setTitle] = useState<string>(post?.title || "");
  const [userId, setUserId] = useState<number>(post?.userId || NaN);
  const [body, setBody] = useState<string>(post?.body || "");

  const navigate = useNavigate();

  if (!post) return <Navigate to="/" />;

  const userOptions = users.map((user) => {
    return (
      <option key={user.id} value={user.id}>
        {user.name}
      </option>
    );
  });

  const handleTitleChanged = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value);
  };
  const handleUserIdChanged = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setUserId(Number(e.target.value));
  };
  const handleBodyChanged = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setBody(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === true) {
      const beginUpdating = async (): Promise<void> => {
        await updatePost({
          id: post.id,
          date: post.date,
          reactions: post.reactions,
          title,
          userId,
          body,
        });
        navigate(`/post/${post.id}`);
      };
      beginUpdating();
    } else {
      setValidated(true);
    }
  };

  const handleDelete = () => {
    deletePost(post);
    navigate("/");
  };

  return (
    <Form
      style={{ maxWidth: "30rem", width: "100%" }}
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <h3 className="mb-4">Edit post</h3>
      <Form.Group className="mb-3" controlId="newPostTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter title"
          required
          name="title"
          value={title}
          onChange={handleTitleChanged}
          disabled={isLoading}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="newPostUser">
        <Form.Label>Select user</Form.Label>
        <Form.Select
          required
          name="userId"
          value={userId}
          onChange={handleUserIdChanged}
          disabled={isLoading}
        >
          {userOptions}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3" controlId="newPostContent">
        <Form.Label>Content</Form.Label>
        <Form.Control
          type="text"
          placeholder="Write your content here..."
          as="textarea"
          style={{ height: "10rem" }}
          required
          name="body"
          value={body}
          onChange={handleBodyChanged}
          disabled={isLoading}
        />
      </Form.Group>
      <Button
        variant="primary"
        type="submit"
        className="w-100 mb-2"
        disabled={isLoading}
      >
        Save Post
      </Button>
      <Button
        variant="outline-danger"
        type="button"
        className="w-100"
        onClick={handleDelete}
        disabled={isLoading}
      >
        Delete Post
      </Button>
    </Form>
  );
};

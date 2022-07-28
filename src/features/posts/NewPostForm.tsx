import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/typed-redux";
import { selectAllUsers } from "../users/usersSlice";
import { useAddNewPostMutation } from "./postsSlice";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export const NewPostForm = (): JSX.Element => {
  const [addNewPost, { isLoading }] = useAddNewPostMutation();

  const [validated, setValidated] = useState<boolean>(false);

  const users = useAppSelector(selectAllUsers);

  const navigate = useNavigate();

  const userOptions = users.map((user) => {
    return (
      <option key={user.id} value={user.id}>
        {user.name}
      </option>
    );
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === true) {
      const beginAdding = async (): Promise<void> => {
        const formData = new FormData(form);
        const title = formData.get("title") as string;
        const userId = Number(formData.get("userId"));
        const body = formData.get("body") as string;
        await addNewPost({ title, userId, body });
        navigate("/");
      };
      beginAdding();
    } else {
      setValidated(true);
    }
  };

  return (
    <Form
      style={{ maxWidth: "30rem", width: "100%" }}
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <h3 className="mb-4">New post</h3>
      <Form.Group className="mb-3" controlId="newPostTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter title"
          required
          name="title"
          disabled={isLoading}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="newPostUser">
        <Form.Label>Select user</Form.Label>
        <Form.Select required name="userId" disabled={isLoading}>
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
          disabled={isLoading}
        />
      </Form.Group>
      <Button variant="primary" type="submit" disabled={isLoading}>
        Submit
      </Button>
    </Form>
  );
};

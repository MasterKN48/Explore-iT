import React, { useState, useContext } from "react";
import { withStyles } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import SendIcon from "@material-ui/icons/Send";
import Divider from "@material-ui/core/Divider";
import { CREATE_COMMENT_MUTATION } from "../../../graphql/mutation";
import { useClient } from "../../../utils";
import context from "../../../context";

const CreateComment = ({ classes }) => {
  const client = useClient();
  const [comment, setComment] = useState("");
  const { state } = useContext(context);
  const { currentPin } = state;
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    console.log("create_comment");
    const variables = { pinId: currentPin._id, text: comment };
    await client.request(CREATE_COMMENT_MUTATION, variables);
    //dispatch({ type: "CREATE_COMMENT", payload: createComment });
    setComment("");
  };
  return (
    <>
      <form className={classes.form}>
        <IconButton
          onClick={() => setComment("")}
          disabled={!comment.trim()}
          className={classes.clearButton}
        >
          <ClearIcon />
        </IconButton>
        <InputBase
          multiline={true}
          className={classes.input}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add Comment"
        />
        <IconButton
          onClick={handleSubmitComment}
          disabled={!comment.trim()}
          className={classes.sendButton}
        >
          <SendIcon />
        </IconButton>
      </form>
      <Divider />
    </>
  );
};

const styles = (theme) => ({
  form: {
    display: "flex",
    alignItems: "center",
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  clearButton: {
    padding: 0,
    color: "red",
  },
  sendButton: {
    padding: 0,
    color: theme.palette.secondary.dark,
  },
});

export default withStyles(styles)(CreateComment);

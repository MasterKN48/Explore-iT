import React, { useState, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import axios from "axios";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";
import context from "../../../context";
import { CREATE_PIN_MUTATION } from "../../../graphql/mutation";
import { useClient } from "../../../utils";

const CreatePin = ({ classes }) => {
  const client = useClient();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [submiting, setSubmiting] = useState(false);
  const { state, dispatch } = useContext(context);

  const handleImageUpload = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "geopins");
    data.append("cloud_name", "dakgnsolg");
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dakgnsolg/image/upload",
      data
    );
    return res.data.url;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmiting(true);
      const url = await handleImageUpload();
      const variables = {
        title,
        image: url,
        content,
        latitude: state.draft.latitude,
        longitude: state.draft.longitude,
      };
      console.log("create_pin");
      await client.request(CREATE_PIN_MUTATION, variables);
      //console.log("Pin Created", { createPin });
      //dispatch({ type: "CREATE_PIN", payload: createPin });
      handleDeleteDraft();
    } catch (error) {
      console.log(error);
      setSubmiting(false);
    }
  };
  const handleDeleteDraft = () => {
    setTitle("");
    setImage("");
    setContent("");
    dispatch({ type: "DELETE_DRAFT" });
  };
  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <Typography
        className={classes.alignCenter}
        component="h2"
        variant="h4"
        color="secondary"
      >
        <LandscapeIcon className={classes.iconLarge} /> Pin location
      </Typography>
      <div>
        <TextField
          onChange={(e) => setTitle(e.target.value)}
          name="title"
          label="Title"
          placeholder="Insert Pin Title"
        />
        <input
          className={classes.input}
          accept="image/*"
          id="image"
          onChange={(e) => setImage(e.target.files[0])}
          type="file"
        />
        <label htmlFor="image">
          <Button
            style={{ color: image && "green" }}
            component="span"
            size="small"
            className={classes.button}
          >
            <AddAPhotoIcon />
          </Button>
        </label>
      </div>
      <div className={classes.contentField}>
        <TextField
          name="content"
          label="Content"
          multiline
          rows="6"
          margin="normal"
          fullWidth
          variant="outlined"
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div>
        <Button
          onClick={handleDeleteDraft}
          className={classes.button}
          variant="contained"
          color="primary"
        >
          <ClearIcon className={classes.leftIcon} /> Discard
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit}
          className={classes.button}
          variant="contained"
          color="secondary"
          disabled={!title.trim() || !content.trim() || !image || submiting}
        >
          Submit
          <SaveIcon className={classes.rightIcon} />
        </Button>
      </div>
    </form>
  );
};

const styles = (theme) => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: theme.spacing(1),
  },
  contentField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "95%",
  },
  input: {
    display: "none",
  },
  alignCenter: {
    display: "flex",
    alignItems: "center",
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing(1),
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing(1),
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing(1),
  },
  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginLeft: 0,
  },
});

export default withStyles(styles)(CreatePin);

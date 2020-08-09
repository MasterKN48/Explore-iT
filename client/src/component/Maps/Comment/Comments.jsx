import React from "react";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { formatDistanceToNow } from "date-fns";

const Comments = ({ classes, data }) => (
  <List className={classes.root}>
    {data.map((cmt, i) => {
      return (
        <ListItem key={i} alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt={cmt.author.name} src={cmt.author.picture} />
          </ListItemAvatar>
          <ListItemText
            primary={cmt.text}
            secondary={
              <>
                <Typography
                  color="textPrimary"
                  className={classes.inline}
                  component="span"
                >
                  {cmt.author.name}
                </Typography>
                ꞏ {formatDistanceToNow(Number(cmt.createdAt))} ago
              </>
            }
          />
        </ListItem>
      );
    })}
  </List>
);

const styles = (theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
});

export default withStyles(styles)(Comments);

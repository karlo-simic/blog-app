import { PostReactions, useAddReactionMutation } from "./postsSlice";
import {
  HandThumbsUp,
  HandThumbsUpFill,
  Heart,
  HeartFill,
  EmojiLaughing,
  EmojiLaughingFill,
  EmojiSunglasses,
  EmojiSunglassesFill,
} from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

type ReactionIcons = {
  [Key in keyof PostReactions]: {
    inactiveIcon: JSX.Element;
    activeIcon: JSX.Element;
    buttonVariant: string;
  };
};

const icons: ReactionIcons = {
  likes: {
    inactiveIcon: <HandThumbsUp />,
    activeIcon: <HandThumbsUpFill />,
    buttonVariant: "outline-primary",
  },
  hearts: {
    inactiveIcon: <Heart />,
    activeIcon: <HeartFill />,
    buttonVariant: "outline-danger",
  },
  laughs: {
    inactiveIcon: <EmojiLaughing />,
    activeIcon: <EmojiLaughingFill />,
    buttonVariant: "outline-warning",
  },
  cool: {
    inactiveIcon: <EmojiSunglasses />,
    activeIcon: <EmojiSunglassesFill />,
    buttonVariant: "outline-success",
  },
};

interface ReactionButtonsProps {
  postId: number;
  reactions: PostReactions;
}

export const ReactionButtons = ({
  postId,
  reactions,
}: ReactionButtonsProps): JSX.Element => {
  const [addReaction] = useAddReactionMutation();

  const buttons = Object.entries(reactions).map((reaction) => {
    const name = reaction[0] as keyof PostReactions;
    const value = reaction[1];
    const isActive = value > 0;
    const iconData = icons[name];

    return (
      <Button
        variant={isActive ? iconData.buttonVariant : "light"}
        key={name}
        onClick={() => {
          const newValue = reactions[name] + 1;
          addReaction({
            postId,
            reactions: { ...reactions, [name]: newValue },
          });
        }}
      >
        {value === 0 && iconData.inactiveIcon}
        {isActive && iconData.activeIcon}
        <span className="ms-2" style={{ verticalAlign: "middle" }}>
          {value}
        </span>
      </Button>
    );
  });

  return (
    <Stack direction="horizontal" gap={2}>
      {buttons}
    </Stack>
  );
};

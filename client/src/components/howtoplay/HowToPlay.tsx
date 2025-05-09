import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const HowToPlay = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <p>how to play</p>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">How to Play</DialogTitle>
          <DialogDescription className="text-lg">
            In guess the word, you're given a mystery word. Your goal is to
            figure out what it is.
            <Separator className="my-4" />
            You could try guessing what it is right away, but the odds of you
            getting it would be pretty unlikely. Instead, you can also ask Yes
            or No questions to try to obtain information about the word, and
            narrow down the possibilities.
            <Separator className="my-4" />
            You win the game when you correctly guess the mystery word! For an
            added challenge, try to do it in as few guesses or in as little time
            as possible.
            <Separator className="my-4" />
            We're using generative AI to respond to your questions, so try to
            make sure they're as clear as possible so that it can understand
            properly!
            <Separator className="my-4" />
            The mystery word changes every day at 00:00 UTC.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default HowToPlay;

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import "./Navbar.css";

function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-links">
        <div className="navbar-links-logo">
          <p>
            <a href="/">guess the word</a>
          </p>
        </div>
        <div className="navbar-links_container">
          <Dialog>
            <DialogTrigger>
              <p>about</p>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-xl">How to Play</DialogTitle>
                <DialogDescription className="text-lg">
                  In guess the word, you're given a mystery word. Your goal is
                  to figure out what it is.
                  <Separator className="my-4" />
                  You could try guessing what it is right away, but the odds of
                  getting it would be pretty unlikely. Instead, you can ask Yes
                  or No questions to try to obtain information about the word
                  and narrow down the possibilties.
                  <Separator className="my-4" />
                  You win the game when you correctly guess the mystery word!
                  For an added challenge, try to do it in as few guesses or in
                  as little time as possible.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default Navbar;

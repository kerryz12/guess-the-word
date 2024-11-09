import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import "./PrivacyPolicy.css";

function PrivacyPolicy() {
  return (
    <div className="privacy-policy-container">
      <Dialog>
        <DialogTrigger asChild>
          <span className="privacy-trigger">Privacy Policy</span>
        </DialogTrigger>
        <DialogContent className="privacy-dialog-content">
          <DialogHeader>
            <DialogTitle className="privacy-title">Privacy Policy</DialogTitle>
          </DialogHeader>
          <DialogDescription className="privacy-description">
            <p>
              Welcome to Guess the Word! Your privacy is important to us. This
              Privacy Policy explains how we collect, use, and share your
              personal information.
            </p>

            <p>
              We collect personal information such as your name, email address,
              and any details you provide during registration. Additionally, we
              may collect usage data such as your IP address, browser type, and
              pages visited to enhance our services. Cookies may also be used to
              improve your experience on the site.
            </p>

            <p>
              Your information is used to provide and personalize our services,
              communicate updates or promotional offers, and improve the
              website's functionality.
            </p>

            <p>
              We may share your information with third-party tools, such as
              analytics providers and payment processors, or as required by law
              to protect our legal rights.
            </p>

            <p>
              You have the right to access, correct, or delete your personal
              information. You can also opt out of communications by contacting
              us at{" "}
              <a href="mailto:kerryzhang12@gmail.com">kerryzhang12@gmail.com</a>
              .
            </p>

            <p>
              We take reasonable measures to protect your data; however, we
              cannot guarantee absolute security.
            </p>

            <p>
              For any questions or concerns, please contact us at{" "}
              <a href="mailto:kerryzhang12@gmail.com">kerryzhang12@gmail.com</a>
              .
            </p>

            <p>By using our website, you agree to this Privacy Policy.</p>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PrivacyPolicy;

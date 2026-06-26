/* =====================================================================
   Cinematic intro — GSAP title reveal that lifts away to reveal the site.
   Ported from the React/GSAP cinematic-hero concept to vanilla JS.
   Plays once on load, then hands off to the main page.
   ===================================================================== */
(function () {
  const intro = document.getElementById("intro");
  if (!intro) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Lock scrolling while the intro is on screen.
  const lockScroll = () => {
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
  };
  const unlockScroll = () => { document.body.style.overflow = ""; };

  // Tear the intro down for good.
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    intro.classList.add("intro-done");
    intro.style.display = "none";
    unlockScroll();
  };

  // No animation engine, or user prefers reduced motion → skip straight to site.
  if (reduceMotion || !window.gsap) {
    finish();
    return;
  }

  lockScroll();
  const gsap = window.gsap;
  const lines = intro.querySelectorAll(".intro-line");

  // Initial hidden states (CSS keeps them visibility:hidden to avoid a flash).
  gsap.set(".intro-eyebrow", { autoAlpha: 0, y: 18 });
  gsap.set(lines, { autoAlpha: 0, y: 64, scale: 0.9, filter: "blur(22px)", rotationX: -18 });
  gsap.set(".intro-tag", { autoAlpha: 0, y: 18 });

  const tl = gsap.timeline({ delay: 0.5, onComplete: finish });

  tl.to(".intro-eyebrow", { autoAlpha: 1, y: 0, duration: 1.4, ease: "power3.out" })
    .to(lines, {
      autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", rotationX: 0,
      duration: 2.4, stagger: 0.32, ease: "expo.out",
    }, "-=0.5")
    .to(".intro-tag", { autoAlpha: 1, y: 0, duration: 1.5, ease: "power3.out" }, "-=1.2")
    .to({}, { duration: 2.2 }) // hold on the brand
    .to("#intro", {
      autoAlpha: 0, scale: 1.08, filter: "blur(16px)",
      duration: 1.7, ease: "power2.inOut",
    });

  // Safety net: never trap the user if a tween stalls.
  setTimeout(finish, 16000);
})();

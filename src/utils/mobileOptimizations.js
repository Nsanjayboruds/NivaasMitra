


const MobileOptimizations = {
  
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  },

  
  isTouch: () => {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  },

  
  optimizeViewport: () => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, viewport-fit=cover"
      );
    }
  },

  
  preventInputZoom: () => {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      const inputs = document.querySelectorAll("input, select, textarea");
      inputs.forEach((input) => {
        if (input.style.fontSize !== "16px") {
          input.style.fontSize = "16px";
        }
      });
    }
  },

  
  addTouchClasses: () => {
    if (MobileOptimizations.isTouch()) {
      document.body.classList.add("touch-device");
    } else {
      document.body.classList.add("no-touch");
    }

    if (MobileOptimizations.isMobile()) {
      document.body.classList.add("mobile-device");
    }
  },

  
  optimizeScrolling: () => {
    
    if (MobileOptimizations.isMobile()) {
      document.documentElement.style.scrollBehavior = "smooth";

      
      document.body.style.overscrollBehavior = "none";
    }
  },

  
  init: () => {
    MobileOptimizations.optimizeViewport();
    MobileOptimizations.addTouchClasses();
    MobileOptimizations.optimizeScrolling();

    
    document.addEventListener("DOMContentLoaded", () => {
      MobileOptimizations.preventInputZoom();
    });

    
    window.addEventListener("resize", () => {
      setTimeout(() => {
        MobileOptimizations.preventInputZoom();
      }, 500);
    });
  },
};


MobileOptimizations.init();

export default MobileOptimizations;

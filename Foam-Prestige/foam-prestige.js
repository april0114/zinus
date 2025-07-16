<script>
let swiper1, swiper2;

document.addEventListener("DOMContentLoaded", function () {
  let currentOpenLayer = null;

  const allAccordions = document.querySelectorAll(".accordion-item");
  const allHotspots = document.querySelectorAll(".hotspot");

  // ✅ 중복 ID 검사
  const id1Count = document.querySelectorAll("#price-table-3-0223").length;
  const id2Count = document.querySelectorAll("#price-table-4-0223").length;


  // ✅ swiper1 초기화
  const swiper1El = document.querySelector("#price-table-3-0223 .mobile-accordion");
  if (swiper1El && id1Count === 1) {
    swiper1 = new Swiper(swiper1El, {
      slidesPerView: 1.1,
      spaceBetween: 16,
      centeredSlides: true,
      pagination: {
        el: "#price-table-3-0223 .swiper-pagination-3",
        clickable: true,
        renderBullet: (index, className) => `<span class="${className}"></span>`,
      },
      on: {
        slideChange: () => {
          const active = swiper1.slides[swiper1.activeIndex];
          const layer = active?.getAttribute("data-layer") ||
                        active?.querySelector("[data-layer]")?.getAttribute("data-layer");
          console.log("swiper1 slideChange → layer:", layer);
          if (layer) activateHotspot(layer);
        },
      },
    });

  } else {
  }

  // ✅ swiper2 초기화
  const swiper2El = document.querySelector("#price-table-4-0223 .mobile-accordion");
  if (swiper2El && id2Count === 1) {
    swiper2 = new Swiper(swiper2El, {
      slidesPerView: 1,
      spaceBetween: 16,
      centeredSlides: true,
      pagination: {
        el: "#price-table-4-0223 .swiper-pagination-4",
        clickable: true,
        renderBullet: (index, className) => `<span class="${className}"></span>`,
      },
      on: {
        slideChange: () => {
          const active = swiper2.slides[swiper2.activeIndex];
          const layer = active?.getAttribute("data-layer") ||
                        active?.querySelector("[data-layer]")?.getAttribute("data-layer");
          console.log("swiper2 slideChange → layer:", layer);
          if (layer) activateHotspot(layer);
        },
      },
    });

  } else {
  }

  // ✅ 아코디언 toggle → 핫스팟 강조
  allAccordions.forEach((item) => {
    item.addEventListener("toggle", () => {
      const layer = item.id.replace("accordion-", "");
      if (item.open) {
        allAccordions.forEach((other) => {
          if (other !== item) other.removeAttribute("open");
        });
        activateHotspot(layer);
        currentOpenLayer = layer;
      } else {
        if (currentOpenLayer === layer) {
          allHotspots.forEach((h) => h.classList.remove("active"));
          currentOpenLayer = null;
        }
      }
    });
  });

  // ✅ hotspot hover / click
  allHotspots.forEach((h) => {
    const layer = h.getAttribute("data-layer");

    // PC hover → 아코디언 열기
    h.addEventListener("mouseenter", () => {
      if (window.innerWidth > 768) {
        openAccordion(layer);
        activateHotspot(layer);
      }
    });

    // click → 슬라이더 이동 (모바일) or 아코디언 열기 (PC)
    h.addEventListener("click", () => {
      if (window.innerWidth > 768) {
        openAccordion(layer);
        activateHotspot(layer);
      } else {
        const swiper = getSwiperByLayer(layer);
        const index = [...swiper.slides].findIndex((slide) => {
          return slide.getAttribute("data-layer") === layer;
        });

        if (index !== -1) {
          swiper.slideTo(index);
          activateHotspot(layer);
        }
      }
    });
  });

  // ✅ 아코디언 열기
  function openAccordion(layer) {
    const target = document.getElementById(`accordion-${layer}`);
    if (!target || target.open) return;
    allAccordions.forEach((acc) => acc.removeAttribute("open"));
    target.setAttribute("open", true);
    currentOpenLayer = layer;
  }

  // ✅ 핫스팟 강조
  function activateHotspot(layer) {
    allHotspots.forEach((h) => h.classList.remove("active"));
    const target = document.querySelector(`.hotspot[data-layer="${layer}"]`);
    if (target) target.classList.add("active");
  }

  // ✅ layer에 따라 해당 swiper 리턴
  function getSwiperByLayer(layer) {
    const n = parseInt(layer, 10);
    return n >= 6 ? swiper2 : swiper1;
  }

let debounceTimer;

const observer = new MutationObserver(() => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    updateVisibleSwipers();
  }, 200); // 0.2초 동안 변화가 없을 때만 실행
});

observer.observe(document.body, {
  childList: true,
  attributes: true,
  subtree: true,
});

 function updateVisibleSwipers() {
  setTimeout(() => {
    const el1 = document.getElementById("price-table-3-0223");
    const el2 = document.getElementById("price-table-4-0223");

    if (el1?.offsetParent !== null && typeof swiper1?.update === "function") {
      swiper1.update();
    }

    if (el2?.offsetParent !== null && typeof swiper2?.update === "function") {
      swiper2.update();
    }
  }, 250); // 전환 후 약간의 지연시간
}
});
</script>

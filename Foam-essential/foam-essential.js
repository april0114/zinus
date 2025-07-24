<script>
let swiper1;

document.addEventListener("DOMContentLoaded", function () {
  let currentOpenLayer = null;
  const allAccordions = document.querySelectorAll(".accordion-item");
  const allHotspots = document.querySelectorAll(".hotspot");

// ✅ swiper1 초기화
const swiperEl = document.querySelector("#price-table-3-0223 .mobile-accordion");
if (swiperEl) {
  swiper1 = new Swiper(swiperEl, {
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
        if (layer) activateHotspot(layer);
      },
    },
  });

  // ✅ 모바일 진입 시 1번 슬라이드 강조 (약간의 지연 후)
  if (window.innerWidth <= 768) {
    setTimeout(() => {
      swiper1.slideTo(0);
      activateHotspot("1");
    }, 200); // 0.2초 지연
  }
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
      } else if (currentOpenLayer === layer) {
        allHotspots.forEach((h) => h.classList.remove("active"));
        currentOpenLayer = null;
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

    // 클릭 시 → 아코디언 열기 or 슬라이드 이동
    h.addEventListener("click", () => {
      if (window.innerWidth > 768) {
        openAccordion(layer);
        activateHotspot(layer);
      } else if (swiper1) {
        const index = [...swiper1.slides].findIndex((slide) => {
          return slide.getAttribute("data-layer") === layer;
        });
        if (index !== -1) {
          swiper1.slideTo(index);
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

  // ✅ Swiper 동적 업데이트 처리
  let debounceTimer;
  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      updateSwiperIfVisible();
    }, 200);
  });

  observer.observe(document.body, {
    childList: true,
    attributes: true,
    subtree: true,
  });

  function updateSwiperIfVisible() {
    setTimeout(() => {
      const el = document.getElementById("price-table-3-0223");
      if (el?.offsetParent !== null && typeof swiper1?.update === "function") {
        swiper1.update();
      }
    }, 250);
  }
});
</script>

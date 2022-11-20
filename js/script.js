jQuery(document).ready(function ($) {
    AOS.init({
        duration: 1000,
        once: true,
    });
    {
        var swiper = new Swiper(".gallery-thumb", {
            direction: "vertical",
            speed: 1000,
            loop: true,
            spaceBetween: 10,
            slidesPerView: "auto",
            freeMode: true,
            watchSlidesProgress: true,
            centeredSlides: true,
        });
        var swiper2 = new Swiper(".gallery-slider", {
            loop: true,
            speed: 1000,
            autoplay: {
                delay: 4000,
            },
            spaceBetween: 10,
            thumbs: {
                swiper: swiper,
            },
        });
    }
    {
        $(".tooltip-copy").mouseleave(function () {
            $(this).find(".tooltiptext").text("Copy to clipboard");
        });
        $(".tooltip-copy").click(function () {
            var input = $(this).find("input")[0];
            input.select();
            input.setSelectionRange(0, 99999);
            navigator.clipboard.writeText(input.value);

            $(this).find(".tooltiptext").text("Copied");
        });
    }
    {
        function onChange() {
            var value = parseInt($(".input-quantity").val());
            var unit = parseInt($(".input-amount").data("unit"));
            $(".input-amount").val(value * unit + " ADA");
        }
        $(".input-quantity").change(onChange);
        $(".input-quantity").keyup(onChange);
    }
    {
        $(".open-popup").click(function () {
            if (!$(".popup").length) return false;
            $(".popup").addClass("open");
            return false;
        });
        $(".close-popup").click(function () {
            if (!$(".popup").length) return false;
            $(".popup").removeClass("open");
            return false;
        });
    }
});

export const fadeIn = (direction, type, delay, duration) => ({
    hidden: {
        x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
        y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
        opacity: 0,
    },
    show: {
        x: 0,
        y: 0,
        opacity: 1,
        transition: {
            type: type,
            delay: delay,
            duration: duration,
            ease: "easeOut",
        },
    },
});

export const staggerContainer = (staggerChildren, delayChildren) => ({
    hidden: {},
    show: {
        transition: {
            staggerChildren: staggerChildren,
            delayChildren: delayChildren || 0,
        },
    },
});

export const hoverScale = {
    hover: {
        scale: 1.05,
        transition: {
            duration: 0.3,
            ease: "easeInOut",
        },
    },
};

export const hoverLift = {
    hover: {
        y: -5,
        transition: {
            duration: 0.3,
            ease: "easeOut",
        },
    },
};

export const slideIn = (direction, type, delay, duration) => ({
    hidden: {
        x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
        y: direction === "up" ? "100%" : direction === "down" ? "100%" : 0,
    },
    show: {
        x: 0,
        y: 0,
        transition: {
            type: type,
            delay: delay,
            duration: duration,
            ease: "easeOut",
        },
    },
});

export const textVariant = (delay) => ({
    hidden: {
        y: 50,
        opacity: 0,
    },
    show: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            duration: 1.25,
            delay: delay,
        },
    },
});

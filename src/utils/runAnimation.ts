export default async function runAnimation(el: Element, animations = []) {
    if (el) {
        const play = (animation: any) => new Promise<void>(resolve => {
            el.classList.add('animate__animated','animate__' + animation.value);

            const removeAnimation = () => {
                el.removeEventListener('animationend', removeAnimation);
                el.removeEventListener('animationcancel', removeAnimation);
                el.classList.remove('animate__animated','animate__' + animation.value);
                resolve();
            };

            el.addEventListener('animationend', removeAnimation);
            el.addEventListener('animationcancel', removeAnimation);
        })

        for (let i = 0, len = animations.length; i < len; i++) {
            await play(animations[i]);
        }
    } else {
        console.log("runAnimation el为空")
    }
}

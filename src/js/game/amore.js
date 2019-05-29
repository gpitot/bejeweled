
window.addEventListener('scroll', function() {
    var titles = [
        document.getElementById("block-text-20254-20253-3-0-0"),
        document.getElementById("block-text-20371-20370-5-0-0"),
        document.getElementById("block-text-20421-20419-7-0-0"),
    ];
    //titles fade in and translateX on reaching

    var backgrounds = [
        document.getElementById("block-column-bg-20253-3"),
        document.getElementById("block-column-bg-20419-7"),
    ];
    //background is image , opacity 0 means that white is showing fully
    //backgrounds opacity 1 before reaching, and 0 at 50%
    //opacity = ratio of 0 - 1 based on scroll height on screen

    for (let i=0; i<backgrounds.length;i+=1) {
        if (backgrounds[i]) {
            updateBackgroundOpacity(backgrounds[i]);
        }
    }


    for (let i=0; i<titles.length;i+=1) {
        if (titles[i]) {
            updateTitlesAnimation(titles[i]);
        }
    }
});

function getPercentageOnScreen(element) {
    //returns percentage on screen 0 = before 1 = fully on screen
    var bounds = element.getBoundingClientRect();
    var percentage = ((window.innerHeight - bounds.top) / bounds.height);
    return percentage;
}

function updateBackgroundOpacity(element) {
    var percentage = getPercentageOnScreen(element);
    var blankPercentage = 0.8;

    if (percentage < 0) {
        element.style.opacity = "1";
        return;
    }

    if (percentage > blankPercentage) {
        element.style.opacity = "0";
        return;
    }
    
    element.style.opacity = (blankPercentage - percentage);
}


function updateTitlesAnimation(element) {
    var percentage = getPercentageOnScreen(element);
    
    if (percentage > 0.9 && percentage < 3) {
        element.classList.remove('fade-in');
        element.classList.remove('fade-out');
    } else {
        element.classList.remove('fade-in');
        element.classList.add('fade-out');
    }

    return;
    if (percentage > 0.2 && percentage < 1) {
        element.classList.remove('fade-in');
        element.classList.add('fade-out');
    } else {
        element.classList.add('fade-in');
        element.classList.remove('fade-out');
    }
}

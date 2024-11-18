function toggle(element) {
    const parentLi = element.parentElement;
    const childUl = parentLi.querySelector('ul');

    if (childUl) {
        childUl.style.display = childUl.style.display === 'none' ? 'block' : 'none';
        element.classList.toggle('open');

        const icon = element.querySelector('.material-icons');
        icon.textContent = icon.textContent === 'arrow_right' ? 'arrow_drop_down' : 'arrow_right';
    }
}
document.querySelectorAll('.tree-view ul ul').forEach(ul => {
    ul.style.display = 'none';
});

document.querySelector('.tree-view').addEventListener('click', (Event) => {
    const parentLi = Event.target.parentElement;
    const childInputs = parentLi.querySelectorAll('input');
    if (Event.target.tagName === 'INPUT' && Event.target.type === 'checkbox') {
        const isChecked = Event.target.checked;
        if (isChecked) {
            parentLi.querySelector('input').checked = false
            checkIt(parentLi, childInputs);
        }
        else {
            let parent = parentLi.parentElement.parentElement;
            uncheckParent(parent)
            const toDelete = Event.target.parentElement.querySelector('text').innerText;
            let thatChip = findChip(toDelete);
            removeChip(thatChip);

        }
    }

})

function checkIt(parentLi, childInputs) {
    const pendingChildInputs = countUnSelected(childInputs);
    if (pendingChildInputs + chipList.length <= 30) {
        console.log(parentLi.querySelector('text').innerHTML + '   ---->   ' + pendingChildInputs)
        childInputs.forEach(child => { child.checked = true; })
        const allUl = parentLi.querySelectorAll('UL');
        const allArrow = parentLi.querySelectorAll('.material-icons')
        allUl.forEach(ul => {
            ul.style.display = 'block';
        });
        allArrow.forEach(icon => {
            icon.textContent = 'arrow_drop_down';
        })
        const childLi = parentLi.querySelectorAll('text');
        childLi.forEach(child => {
            createChip(child.textContent)
        })
        document.getElementById('message').innerText = ""
        childInputs[childInputs.length - 1].checked = true
        checkParent(parentLi)

    }
    else
        document.getElementById('message').innerText = "Can't select more than 30"
}

const countUnSelected = (l) => {
    let count = 0;
    l.forEach(i => { if (!i.checked) count++; })
    if (!count) return 1;
    return count;
}

const uncheckParent = (parent) => {
    while (parent.tagName == 'LI') {
        parent.querySelector('input').checked = false;
        // console.log("I am problem2")
        let thatChip = findChip(parent.querySelector('text').innerText)
        removeChip(thatChip)
        parent = parent.parentElement.parentElement;
    }
    updateCount();
}

const checkParent = (child) => {
    if (child.tagName === 'LI' && chipList.length < 29) {
        let parent = child.parentElement.parentElement;
        const children = parent.querySelectorAll('input');
        let allChecked = true;
        for (let i = 1; i < children.length; i++) {
            if (!children[i].checked) { allChecked = false; break; }
        }
        if (allChecked) {
            parent.querySelector('input').checked = true;
            createChip(parent.querySelector('text').innerText)
        }
        checkParent(parent);
    }
}

const findChip = (toDelete) => {
    const allChips = document.querySelectorAll('.Chips-Container .chip text');
    let thatChip;
    allChips.forEach(chip => {
        if (chip.textContent === toDelete) { thatChip = chip.parentElement; }
    })
    return thatChip;
}

const chipList = [];
const createChip = function (text) {
    if (!chipList.includes(text)) {
        const chip = document.createElement('div');
        chip.classList.add('chip');
        chip.innerHTML = `<text>${text}</text>`;
        const chip_x = document.createElement('i');
        chip_x.classList.add('material-icons');
        chip_x.innerText = 'close';
        chip_x.addEventListener('click', (Event) => {
            console.log(Event.target.parentElement)
            removeChip(Event.target.parentElement)
            const tree = document.querySelector('.tree-view')
            const treeLi = tree.querySelectorAll('LI');
            treeLi.forEach(li => {
                const liText = li.querySelector('text');
                if (liText.textContent === text) {
                    const li = liText.parentElement
                    li.querySelector('input').checked = false;
                    console.log("I am problem3")
                    uncheckParent(li.parentElement.parentElement);
                }
            })
        })
        chip.append(chip_x)
        document.querySelector('.Chips-Container').append(chip);
        chipList.push(text)
        checkBox(text);
    }
}

const checkBox = (text) => {
    // const li = findLI(text);
    // console.log(li)
    const allLI = document.querySelectorAll('li text')
    allLI.forEach(li => {
        if (li.innerText == text) {
            li.parentElement.querySelector('input').checked = true;
            const parentLi = li.parentElement;
            const childInputs = parentLi.querySelectorAll('input');
            checkIt(parentLi, childInputs)
        }
    })

    updateCount()
}

// function findLI(text) {
//     const allLI = document.querySelectorAll('li text')
//     allLI.forEach(li => {
//         if (li.innerText == text) { console.log(li); return li; }
//     })
// }

document.querySelector('.clear').addEventListener('click', () => {
    const allCheckBox = document.querySelector('.tree-view').querySelectorAll('input');
    allCheckBox.forEach(box => box.checked = false)
    console.log("I am problem4")

    document.querySelector('.Chips-Container').innerHTML = ''
    chipList.length = 0;
    document.querySelector('#message').innerText = ''
    updateCount();

})

const removeChip = (chip) => {
    if (chip) {
        chip.remove();
        chipList.splice(chipList.indexOf(chip.querySelector('text').innerText), 1);
        const tree = document.querySelectorAll('.tree-view text');
        tree.forEach(node => {
            if (node.parentElement.querySelector('input').checked === false) {
                const thatChip = findChip(node.innerText)
                removeChip(thatChip)
            }
            updateCount();
        })
    }
}
const updateCount = () => {
    document.getElementById('chip-count').innerHTML = chipList.length;
}

const items = ["Products", "Laboratory Balances", "Pocket balances", "Pocket balances 1", "Pocket balances 2", "Pocket balances 3", "Pocket balances 4", "School balances", "Analytical balances", "Precision balances", "Moisture analyser", "Industrial scales", "Bench scales", "Drive-through scales", "Pallet scales", "Food", "Price computing scales", "Counting scales", "Medical scales", "Premium Line", "Baby scales", "Personal scales", "Bathroom scales", "Handrail scales", "Wheelchair platform scales", "Chair scales", "Test weights", "OIML E1", "OIML E2", "OIML F1", "OIML F2", "OIML M1", "OIML M2", "OIML M3", "Measuring instruments", "Force gauges", "Torque gauges", "Coating thickness gauges", "Material thickness gauges", "Hardness tester of plastics"];
function clearInput() {
    document.getElementById('chip-input').value = '';
}

let currentFocus = -1;

function closeAllLists() {
    document.getElementById("autocomplete-list").innerHTML = '';
}

document.getElementById("chip-input").addEventListener("input", function () {
    const input = this.value.toLowerCase();
    closeAllLists();
    const listContainer = document.getElementById("autocomplete-list");
    listContainer.style.display = 'block';// Show the dropdown
    if (!input) { listContainer.style.display = 'none'; return };
    let count = 0;
    items.forEach((item) => {
        if (item.toLowerCase().includes(input) && !chipList.includes(item)) {
            const itemDiv = document.createElement("div");
            itemDiv.innerHTML = item;
            itemDiv.addEventListener("click", function () {
                createChip(item);
            });
            itemDiv.addEventListener("keydown", function (e) {
                if (e.key === 'Enter') {
                    createChip(item);
                }
            });
            listContainer.appendChild(itemDiv);
            count++;
        }
    });
    if (count > 10) {
        listContainer.classList.add('scroll-div');
    } else {
        listContainer.classList.remove('scroll-div');
    }
});
const itemsList = document.getElementById("autocomplete-list").getElementsByTagName("div");

document.getElementById("chip-input").addEventListener("keydown", function (e) {
    if (e.key === 'ArrowDown') {
        currentFocus++;
        addActive(itemsList);
        e.preventDefault(); // Prevent default scrolling behavior
        scrollIntoView(itemsList[currentFocus]); // Scroll into view
    } else if (e.key === 'ArrowUp') {
        currentFocus--;
        addActive(itemsList);
        e.preventDefault(); // Prevent default scrolling behavior
        scrollIntoView(itemsList[currentFocus]); // Scroll into view
    } else if (e.key === 'Enter') {
        e.preventDefault(); // Prevent form submission or other default actions
        if (currentFocus > -1 && itemsList[currentFocus]) {
            // document.getElementById('parent-ul').style.display = 'block'
            // showParents()
            checkBox(itemsList[currentFocus].innerText);
            const listContainer = document.getElementById("autocomplete-list");
            listContainer.style.display = 'none'; // Hide dropdown after selection
            currentFocus = -1
            clearInput()
        }
    }
});

function addActive(itemsList) {
    if (!itemsList.length) return;
    removeActive(itemsList);
    if (currentFocus >= itemsList.length) currentFocus = 0; // Loop to first item
    if (currentFocus < 0) currentFocus = itemsList.length - 1; // Loop to last item
    itemsList[currentFocus].classList.add("autocomplete-active");
}

function removeActive(itemsList) {
    for (let i = 0; i < itemsList.length; i++) {
        itemsList[i].classList.remove("autocomplete-active");
    }
}

function scrollIntoView(element) {
    if (!element) return;
    const listContainer = document.getElementById("autocomplete-list");
    const containerHeight = listContainer.clientHeight;
    const elementTop = element.offsetTop;
    const elementHeight = element.clientHeight;
    if (elementTop < listContainer.scrollTop) {
        listContainer.scrollTop = elementTop; // Scroll up to the focused element
    } else if (elementTop + elementHeight > listContainer.scrollTop + containerHeight) {
        listContainer.scrollTop = elementTop + elementHeight - containerHeight; // Scroll down to keep it in view
    }
}

document.addEventListener("click", function (e) {
    if (!e.target.matches('#chip-input')) {
        // closeAllLists();
        const listContainer = document.getElementById("autocomplete-list");
        listContainer.style.display = 'none';
        currentFocus = -1
        clearInput()
    }
});

document.getElementById('autocomplete-list').addEventListener('mouseover', (E) => {
    const divs = document.getElementById('autocomplete-list').querySelectorAll('div')
    const item_List = document.getElementById("autocomplete-list").querySelectorAll('div');

    divs.forEach(div => div.classList.remove('autocomplete-active'))
    E.target.classList.add('autocomplete-active')
    for (let i = 0; i < item_List.length; i++)
        if (item_List[i] == E.target)
            currentFocus = i
});
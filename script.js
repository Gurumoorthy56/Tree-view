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
            // let count;
            const pendingChildInputs = countUnSelected(childInputs);
            // console.log(pendingChildInputs)
            if (chipList.length <= 30 && pendingChildInputs + chipList.length <= 30) {
                childInputs.forEach(child => { child.checked = true; })
                const allUl = parentLi.querySelectorAll('UL');
                const allArrow = parentLi.querySelectorAll('.material-icons')
                allUl.forEach(ul => {
                    ul.style.display = 'block';
                });
                allArrow.forEach(icon => {
                    icon.textContent = 'arrow_drop_down';
                })
                checkParent(parentLi)

                const childLi = parentLi.querySelectorAll('text');
                childLi.forEach(child => {
                    createChip(child.textContent)
                    document.getElementById('message').innerText = ""
                })
            }
            else {
                parentLi.querySelector('input').checked = false;
                document.getElementById('message').innerText = "Can't select more than 30"
            }
        }
        else {
            childInputs.forEach(child => { child.checked = false; });
            let parent = parentLi.parentElement.parentElement;
            uncheckParent(parent)
            const toDelete = Event.target.parentElement.querySelector('text').innerText;
            let thatChip = findChip(toDelete);
            removeChip(thatChip);

        }
    }

})

const countUnSelected = (l) => {
    let count = 0;
    l.forEach(i => { if (!i.checked) count++; })
    return count + 1;
}

const uncheckParent = (parent) => {
    while (parent.tagName == 'LI') {
        parent.querySelector('input').checked = false;
        parent = parent.parentElement.parentElement;
        // console.log(parent.querySelector('text').innerText);
        let thatChip = findChip(parent.querySelector('text').innerText)
        removeChip(thatChip)
    }
}

const checkParent = (child) => {
    if (child.tagName === 'LI' && chipList.length < 29) {
        let parent = child.parentElement.parentElement;
        const children = parent.querySelectorAll('input');
        let allChecked = true;
        for (let i = 1; i < children.length; i++) {
            if (!children[i].checked)
                allChecked = false;
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
            removeChip(Event.target.parentElement)
            const tree = document.querySelector('.tree-view')
            const treeLi = tree.querySelectorAll('LI');
            // console.log(treeLi)
            treeLi.forEach(li => {
                const liText = li.querySelector('text');
                if (liText.textContent === text) {
                    const li = liText.parentElement
                    li.querySelector('input').checked = false;
                    uncheckParent(li.parentElement.parentElement);
                    // console.log(li.parentElement.parentElement);
                }
            })
        })
        chip.append(chip_x)
        document.querySelector('.Chips-Container').append(chip);
        chipList.push(text)
        updateCount();
    }
}

document.querySelector('.clear').addEventListener('click', () => {
    const allCheckBox = document.querySelector('.tree-view').querySelectorAll('input');
    allCheckBox.forEach(box => box.checked = false)
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

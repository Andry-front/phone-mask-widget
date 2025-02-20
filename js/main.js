document.addEventListener('DOMContentLoaded', () => {
    const createPhoneMask = (inputElement) => {
        const mask = '+380(___)___-__-__';

        let arrayInputDate = [],
            positionCursor = 0;

        const formatedMask = [...mask].map((elementMask, index) => {
            const obj = {data: elementMask};

            elementMask === '_' && arrayInputDate.push({data: '_', indexMask: index})
            return obj;
        }),
            renderValueInput = (array, input, cursor) => {
                input.value = array.reduce((acc, item) => acc + item.data, '');

                setTimeout(() => {
                    inputElement.selectionStart = inputElement.selectionEnd = cursor;
                }, 10);
            };

        const eventArrayInputDate = (string, array, start) => {
                let indexStart = array.findIndex(item => item['indexMask'] >= start);

                const arrayString = [...string].map((item) => {
                    return {
                        data: item,
                        indexString: indexStart++
                    }
                });

                array.forEach((item, index) => {

                    arrayString.forEach((itemString) => {
                        if (index === itemString.indexString) item.data = itemString.data;
                    });
                });

                const lastObjectString = arrayString[arrayString.length - 1];
                const lastObjectStringCopy = { ...lastObjectString };

                const objLast = array[lastObjectStringCopy.indexString + 1] ||
                    array[array.length - 1];

                positionCursor = array[lastObjectStringCopy.indexString + 1] ?
                    objLast['indexMask'] :
                    array[array.length - 1].indexMask + 1;
            },
            eventArrayMask = (input, mask) => {
                mask.forEach((item, index) => {

                    input.forEach((itemInput) => {
                        if (index === itemInput['indexMask']) {
                            item.data = itemInput.data;
                        }
                    })
                });
            },
            eventValueInput = (array, input) => {
                input.value = array.reduce((acc, item) => acc + item.data, '');
            };

        const handleFocus = (formatedMask) => (event) =>  {
            const cursor = formatedMask.findIndex(item => item.data === '_');
                renderValueInput(formatedMask, event.target, cursor);
            },
            handleBlur = () =>  {},
            eventMackPhone = (arrayMask, arrayInputDate) => (event) => {
                event.preventDefault();

                const start = inputElement.selectionStart;

                if (event.inputType === 'insertText' ||
                event.inputType === 'insertFromPaste') {
                    const inputChars = event.data.replace(/\D/g, '');

                    eventArrayInputDate(inputChars, arrayInputDate, start);

                } else if (event.inputType === 'deleteContentBackward' ||
                event.inputType === 'deleteContentForward') {
                    let end = inputElement.selectionEnd;

                    if (end === start) {

                        eventArrayInputDate('_', arrayInputDate, start - 1);

                        positionCursor = start - 1;
                    } else {
                        const numberCharactersDeleted = end - start;

                        const arrayDeleted = Array.from({length: numberCharactersDeleted}, () => '_');

                        eventArrayInputDate(arrayDeleted, arrayInputDate, start);

                        positionCursor = start;
                    }
                }

                eventArrayMask(arrayInputDate, arrayMask);

                eventValueInput(arrayMask, event.target);

                inputElement.selectionStart = inputElement.selectionEnd = positionCursor;
        };

        inputElement.addEventListener('beforeinput', eventMackPhone(formatedMask, arrayInputDate));
        inputElement.addEventListener('focus', handleFocus(formatedMask));
        inputElement.addEventListener('blur', handleBlur(formatedMask));
    }

    const phoneInput = document.getElementById('phone');
    createPhoneMask(phoneInput);

}, false)
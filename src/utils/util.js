export const delay = (ms) => {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
};

export const errorStrings = {
    1 : 'Select currency first.',
    2 : 'The bet amount you entered is more than your balance.',
    3:  ''
}
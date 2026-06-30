const canvacord = require("canvacord");

const { Font, FontFactory } = require("canvacord")
if(!FontFactory.size) {
    Font.loadDefault()
}

async function test() {
    console.time("png");

    const card = new canvacord.RankCardBuilder()
        .setUsername("test")
        .setLevel(1)
        .setCurrentXP(10)
        .setRequiredXP(100)
        .setAvatar("./test_avatar.png");

    await card.build();

    console.timeEnd("png");
}

test();

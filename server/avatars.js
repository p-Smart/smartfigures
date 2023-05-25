const avatars =[
    '/assets/avatars/avatar-alcides-antonio.png',
    '/assets/avatars/avatar-anika-visser.png',
    '/assets/avatars/avatar-cao-yu.png',
    '/assets/avatars/avatar-carson-darrin.png',
    '/assets/avatars/avatar-chinasa-neo.png',
    '/assets/avatars/avatar-fran-perez.png',
    '/assets/avatars/avatar-iulia-albu.png',
    '/assets/avatars/avatar-jane-rotanson.png',
    '/assets/avatars/avatar-jie-yan-song.png',
    '/assets/avatars/avatar-marcus-finn.png',
    '/assets/avatars/avatar-miron-vitold.png',
    '/assets/avatars/avatar-nasimiyu-danai.png',
    '/assets/avatars/avatar-neha-punita.png',
    '/assets/avatars/avatar-omar-darboe.png',
    '/assets/avatars/avatar-penjani-inyene.png',
    '/assets/avatars/avatar-seo-hyeon-ji.png',
    '/assets/avatars/avatar-siegbert-gottfried.png',
]
function getAvatar(){
    const randomIndex = Math.floor(Math.random() * avatars.length);
    const randomAvatar = avatars[randomIndex];
    return randomAvatar
}


module.exports = getAvatar
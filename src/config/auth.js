
// 로그인한 유저의 정보 가져오기
const getUserData = () => {
    const userDataJson = localStorage.getItem('userData')
    return  JSON.parse(userDataJson);
};

// 인증 토큰만 가져오기
export const getUserToken = () => {
    console.log(getUserData().token)
  return getUserData().token;
};

// 로그인 회원정보를 불러오는 Loader
export const userDataLoader = () => {
    return getUserData();
}


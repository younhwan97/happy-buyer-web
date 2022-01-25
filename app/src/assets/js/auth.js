function readUser(){
    const loginId = document.querySelector('#loginId').value
    const password = document.querySelector('#password').value

    const fd = new FormData()
    fd.append('loginId', loginId)
    fd.append('loginPassword', password)

    fetch('/auth/login/login_process', {
        method: 'POST',
        body: fd
    })
        .then(res => res.json())
        .then(json => {
            if(json.success){ // 로그인 성공

                location.href='/'

            } else { // 로그인 실패

            }
        })
        .catch(err => console.error(err))
}

function logoutUser(){

}
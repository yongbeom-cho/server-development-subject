# server-development-subject
1. 문제 해결 전략
	nodejs와 ejs view engine을 사용하여 구현.
	웹페이지 제공 (route/index.js)
		로그아웃 시 webpage가 끄게하기 위해 "/" path로 접근하면 로그인 화면을 새탭으로 열 수있는 페이지가 존재.
		a. 로그인 화면
			1. views/login.ejs로 "로그인" 버튼을 누르면 "https://kauth.kakao.com/oauth/authorize" 접근.
			2. 카카오 인증 시 kakao에서 "code" 번호와 함께 "/callback" uri로 redirect.
			3. code를 정보와 함께 "https://kauth.kakao.com/oauth/token"에 POST.
			4. response에 access_token 및 refresh_token을 얻음.
			5. access_token과 함께 "https://kapi.kakao.com/v2/user/me" GET하여 nickname 정보를 얻어와 RDB에 저장.
			6. mainpage.ejs를 rendering (사용자 정보는 보여주지 않음)
		b. 사용자 정보 조회
			1. mainpage.ejs에서 "사용자 정보 조회" 버튼을 클릭
			2. app_user_id와 함께 "/userinfo"로 GET 요청
			3. app_user_id로 RDB 조회 후 mainpage.ejs를 render(사용자 정보 보여준다는 표시와 함께)
		c. 탈퇴하기
			1. mainpage.ejs에서 "탈퇴하기" 버튼 클릭
			2. "/leave"에 access_token과 함께 POST 요청.
			3. access_token을 request header에 담아 "https://kapi.kakao.com/v1/user/unlink"에 POST
			4. response에 body.id의 app_user_id를 통해 RDB에 app_user_id를 가지는 회원 정보를 삭제후 login page render
		d. 로그아웃
			1. mainpage.ejs에서 "로그아웃" 버튼 클릭
			2. "/logout"에 access_token과 함께 POST 요청.
			3. access_token을 request header에 담아 "https://kapi.kakao.com/v1/user/logout"에 POST
			4. web browser 종료하기 위해 close.ejs render ("/" path로 접근하여 로그인 화면을 새탭으로 연 페이지만 tab이 닫힘)
		e. 로그조회
			1. mainpage.ejs에서 "로그 조회" 버튼 클릭
			2. "/log" GET 요청.
			3. RDB에 저장한 모든 log를 logview.ejs에 render
		f. 검색 페이지
			1. logview.ejs에서 검색할 내용을 치고 "로그 검색" 클릭
			2. "/log/search"에 검색할 내용 (search_content) 과 함께 GET 요청
			3, RDB에서 search_content가 포함된 log를 찾아 logview.ejs render
	회원 관리 API 제공 (route/api.js)
		a. 개인 회원 API (검색, 수정, 삭제)
			검색 
				1. "api/user/{appUserId}"로 GET 요청
				2. RDB에서 app_user_id로 찾아 userinfo json으로 응답.
			수정 
				1. "api/user/{appUserId}"로 nickname과 함께 PUT 요청
				2. RDB에서 app_user_id로 찾아 nickname 변경 후 json으로 응답. (성공시 true, 실패시 false)
			삭제 
				1. "api/user/{appUserId}"로 DELETE 요청
				2. RDB에서 app_user_id로 찾아 삭제 후 json으로 응답. (성공시 true, 실패시 false)
		b. 전체 회원 API (검색)
			전체 회원
				1. "api/users"로 GET 요청
				2. RDB에서 모든 userinfo찾아 json으로 응답.
			특정 회원 검색
				1. "api/users/?nickname=XXXX"로 GET 요청
				2. RDB에서 nickname이 XXXX인 userinfo 찾아 json으로 응답.
	로그 관리 기능
		모든 Request(Header, Body), Response (Header, Body)에 대한 로깅
			1. app.js에서 middleware/logger.js에서 log 함수 middleware로 등록
			2. log함수에서 res.end() 시 request {headers, body}, response {headers, body} 만들어 RDB에 type (Request or Response), header, body 로 저장.
2. 프로젝트 빌드
	mysql 설치
	node js 설치
3. 실행 방법
	1. mysql 실행 (root password : asdf1234, PATH 설정)
	2. ddl 구문 실행 
		create database kakao;
	3. 서버 실행
		git clone 받은 dir에서 "npm start" 쓰고 enter
	4. 크롬 webbrowser 실행
		localhost:8080 접속
	5. unit test 실행
		git clone 받은 dir에서 "npm test" 쓰고 enter
	
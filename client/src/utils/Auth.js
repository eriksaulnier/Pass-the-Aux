import Cookies from 'js-cookie';

export default userId => {
  return Cookies.get('user_id') === userId;
};

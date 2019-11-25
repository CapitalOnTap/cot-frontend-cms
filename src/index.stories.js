import 'bootstrap/dist/css/bootstrap.css';

export default { title: 'Button' };

export const withText = () => '<button class="btn btn-warning font-weight-bold m-auto m-lg-0">SUBMIT</button>';

export const withEmoji = () => {
  const button = document.createElement('button');
  button.innerText = '😀 😎 👍 💯';
  return button;
};
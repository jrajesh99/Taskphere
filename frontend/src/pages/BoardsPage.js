import BoardForm from "../components/BoardForm";
import BoardList from '../components/BoardList';

export default function BoardsPage() {
  return (
    <div>
      <h2>Create a Board</h2>
      <BoardForm />
      <div>
        <BoardList />
      </div>
    </div>
  );
}

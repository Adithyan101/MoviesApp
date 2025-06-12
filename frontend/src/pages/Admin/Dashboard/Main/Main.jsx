import SecondaryCard from "./SecondaryCard";
import PrimaryCard from "./PrimaryCard";
import VideoCard from "./VideoCard";
import RealTimeCard from "./RealTimeCard";

import {
  useGetAllMoviesQuery,
  useGetTopMoviesQuery,
} from "../../../../redux/api/movie";
import { useGetUsersQuery } from "../../../../redux/api/user";

const Main = () => {
  const { data: allMovies } = useGetAllMoviesQuery();
  const { data: topMovies } = useGetTopMoviesQuery();
  const { data: users } = useGetUsersQuery();

  console.log("allMovies", allMovies);
  console.log("topMovies", topMovies);

   const totalCommentsLength = allMovies?.movies?.map((m) => m.numOfReviews);
  const sumOfCommentsLength = totalCommentsLength?.reduce(
    (acc, length) => acc + length,
    0
  );

  return (
    <div>
      <section className="flex justify-around">
        <div className="ml-[14rem] mt-10">
          <div className="-translate-x-4 flex">
            <SecondaryCard
              pill="Users"
              content={users?.length}
              gradient="from-teal-500 to-line-400"
            />
              <SecondaryCard
              pill="Comments"
              content={sumOfCommentsLength}
              gradient="from-[#00b4d8] to-line-400"
            />
              <SecondaryCard
              pill="Movies"
              content={allMovies?.movies?.length}
              gradient="from-green-500 to-line-400"
            />
          </div>

           <div className="flex justify-between w-[90%] text-white mt-10 font-bold">
            <p>Top Content</p>
            <p>Comments</p>
          </div>

          {topMovies?.topRatedMovies?.map((movie) => (

            <VideoCard
              key={movie._id}
              image={movie.image}
              title={movie.name}
              date={movie.year}
              comments={movie.numReviews}
            />
          ))}
        </div>

         <div>
          <RealTimeCard />
        </div>

      
      </section>
    </div>
  );
};

export default Main;

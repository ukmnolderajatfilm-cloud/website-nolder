const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedFilms() {
  console.log('🌱 Seeding films...')

  // Get admin user
  const admin = await prisma.admin.findFirst({
    where: { username: 'AdminN0lder' }
  })

  if (!admin) {
    console.error('❌ Admin user not found. Please run setup-db.js first.')
    process.exit(1)
  }

  const sampleFilms = [
    {
      filmTitle: "The Dark Knight",
      filmGenre: "Action, Crime, Drama",
      rating: 9.0,
      duration: 152,
      director: "Christopher Nolan",
      releaseDate: new Date("2008-07-18"),
      status: "now_showing",
      description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      posterUrl: "/uploads/1758954623342-jqnx11xrb3o.png",
      trailerUrl: "https://youtube.com/watch?v=EXeTwQWrcwY",
      adminId: admin.id
    },
    {
      filmTitle: "Inception",
      filmGenre: "Action, Sci-Fi, Thriller",
      rating: 8.8,
      duration: 148,
      director: "Christopher Nolan",
      releaseDate: new Date("2010-07-16"),
      status: "now_showing",
      description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
      trailerUrl: "https://youtube.com/watch?v=YoHD9XEInc0",
      adminId: admin.id
    },
    {
      filmTitle: "Interstellar",
      filmGenre: "Adventure, Drama, Sci-Fi",
      rating: 8.6,
      duration: 169,
      director: "Christopher Nolan",
      releaseDate: new Date("2014-11-07"),
      status: "now_showing",
      description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
      trailerUrl: "https://youtube.com/watch?v=zSWdZVtXT7E",
      adminId: admin.id
    },
    {
      filmTitle: "The Matrix",
      filmGenre: "Action, Sci-Fi",
      rating: 8.7,
      duration: 136,
      director: "The Wachowskis",
      releaseDate: new Date("1999-03-31"),
      status: "archived",
      description: "A computer hacker learns about the true nature of reality and his role in the war against its controllers.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
      trailerUrl: "https://youtube.com/watch?v=vKQi3bBA1y8",
      adminId: admin.id
    },
    {
      filmTitle: "Pulp Fiction",
      filmGenre: "Crime, Drama",
      rating: 8.9,
      duration: 154,
      director: "Quentin Tarantino",
      releaseDate: new Date("1994-10-14"),
      status: "archived",
      description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
      trailerUrl: "https://youtube.com/watch?v=s7EdQ4FqbhY",
      adminId: admin.id
    },
    {
      filmTitle: "The Godfather",
      filmGenre: "Crime, Drama",
      rating: 9.2,
      duration: 175,
      director: "Francis Ford Coppola",
      releaseDate: new Date("1972-03-24"),
      status: "archived",
      description: "The aging patriarch of a crime family transfers control of his clandestine empire to his reluctant son.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
      trailerUrl: "https://youtube.com/watch?v=sY1S34973zA",
      adminId: admin.id
    },
    {
      filmTitle: "Avatar: The Way of Water",
      filmGenre: "Action, Adventure, Fantasy",
      rating: 7.8,
      duration: 192,
      director: "James Cameron",
      releaseDate: new Date("2022-12-16"),
      status: "coming_soon",
      description: "Set more than a decade after the events of the first film, Avatar: The Way of Water begins to tell the story of the Sully family, the trouble that follows them, the lengths they go to keep each other safe.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
      trailerUrl: "https://youtube.com/watch?v=d9MyW72ELq0",
      adminId: admin.id
    },
    {
      filmTitle: "Top Gun: Maverick",
      filmGenre: "Action, Drama",
      rating: 8.3,
      duration: 130,
      director: "Joseph Kosinski",
      releaseDate: new Date("2022-05-27"),
      status: "now_showing",
      description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
      trailerUrl: "https://youtube.com/watch?v=qSqVVswa420",
      adminId: admin.id
    },
    {
      filmTitle: "Spider-Man: No Way Home",
      filmGenre: "Action, Adventure, Fantasy",
      rating: 8.2,
      duration: 148,
      director: "Jon Watts",
      releaseDate: new Date("2021-12-17"),
      status: "now_showing",
      description: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
      trailerUrl: "https://youtube.com/watch?v=JfVOs4VSpmA",
      adminId: admin.id
    },
    {
      filmTitle: "Dune",
      filmGenre: "Adventure, Drama, Sci-Fi",
      rating: 8.0,
      duration: 155,
      director: "Denis Villeneuve",
      releaseDate: new Date("2021-10-22"),
      status: "now_showing",
      description: "Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
      trailerUrl: "https://youtube.com/watch?v=n9xhJrPXop4",
      adminId: admin.id
    },
    {
      filmTitle: "The Batman",
      filmGenre: "Action, Crime, Drama",
      rating: 7.8,
      duration: 176,
      director: "Matt Reeves",
      releaseDate: new Date("2022-03-04"),
      status: "coming_soon",
      description: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
      trailerUrl: "https://youtube.com/watch?v=mqqft2x_Aa4",
      adminId: admin.id
    },
    {
      filmTitle: "Everything Everywhere All at Once",
      filmGenre: "Action, Adventure, Comedy",
      rating: 8.1,
      duration: 139,
      director: "Daniel Kwan, Daniel Scheinert",
      releaseDate: new Date("2022-03-25"),
      status: "now_showing",
      description: "A middle-aged Chinese immigrant is swept up in an insane adventure in which she alone can save the world by exploring other universes connecting with the lives she could have led.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
      trailerUrl: "https://youtube.com/watch?v=wxN1T1uxQ2g",
      adminId: admin.id
    },
    {
      filmTitle: "Black Panther: Wakanda Forever",
      filmGenre: "Action, Adventure, Drama",
      rating: 6.7,
      duration: 161,
      director: "Ryan Coogler",
      releaseDate: new Date("2022-11-11"),
      status: "coming_soon",
      description: "The nation of Wakanda is pitted against intervening world powers as they mourn the loss of their king T'Challa.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
      trailerUrl: "https://youtube.com/watch?v=_Z3QKkl1WyM",
      adminId: admin.id
    },
    {
      filmTitle: "Doctor Strange in the Multiverse of Madness",
      filmGenre: "Action, Adventure, Fantasy",
      rating: 6.9,
      duration: 126,
      director: "Sam Raimi",
      releaseDate: new Date("2022-05-06"),
      status: "now_showing",
      description: "Dr. Stephen Strange casts a forbidden spell that opens the doorway to the multiverse, including alternate versions of himself, whose threat to humanity is too great for the combined forces of Strange, Wong, and Wanda Maximoff.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
      trailerUrl: "https://youtube.com/watch?v=aWzlQ2N6qqg",
      adminId: admin.id
    },
    {
      filmTitle: "Thor: Love and Thunder",
      filmGenre: "Action, Adventure, Comedy",
      rating: 6.2,
      duration: 119,
      director: "Taika Waititi",
      releaseDate: new Date("2022-07-08"),
      status: "archived",
      description: "Thor enlists the help of Valkyrie, Korg and ex-girlfriend Jane Foster to fight Gorr the God Butcher, who intends to make the gods extinct.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
      trailerUrl: "https://youtube.com/watch?v=Go8nTmfrQd8",
      adminId: admin.id
    }
  ]

  try {
    // Clear existing films
    await prisma.film.deleteMany({})
    console.log('🗑️  Cleared existing films')

    // Create sample films
    for (const film of sampleFilms) {
      await prisma.film.create({ data: film })
    }

    console.log(`✅ Created ${sampleFilms.length} sample films`)
    
    // Show statistics
    const stats = await prisma.film.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    })

    console.log('\n📊 Film Statistics:')
    stats.forEach(stat => {
      console.log(`  ${stat.status}: ${stat._count.status} films`)
    })

    const totalFilms = await prisma.film.count()
    console.log(`\n🎬 Total films: ${totalFilms}`)

  } catch (error) {
    console.error('❌ Error seeding films:', error)
    throw error
  }
}

async function main() {
  try {
    await seedFilms()
  } catch (error) {
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}

module.exports = { seedFilms }

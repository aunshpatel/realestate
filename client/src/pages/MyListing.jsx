import * as React from 'react';
import { styled } from '@mui/system';
import { TablePagination, tablePaginationClasses as classes } from '@mui/base/TablePagination';
import FirstPageRoundedIcon from '@mui/icons-material/FirstPageRounded';
import LastPageRoundedIcon from '@mui/icons-material/LastPageRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { ref, getStorage, deleteObject } from 'firebase/storage';
import {useSelector} from 'react-redux';
import { Link } from 'react-router-dom';

export default function MyListing() {
    // const [listing, setListing] = React.useState(null);
    const [showListingsError, setShowListingsError] = React.useState(false);
    const {currentUser} = useSelector((state) => state.user);
    const [userListings, setUserListings] = React.useState([]);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userListings.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const CustomTablePagination = styled(TablePagination)(
        ({ theme }) => `
        & .${classes.spacer} {
          display: none;
        }
      
        & .${classes.toolbar}  {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          padding: 4px 0;
      
          @media (min-width: 768px) {
            flex-direction: row;
            align-items: center;
          }
        }
      
        & .${classes.selectLabel} {
          margin: 0;
          text-transform: capitalize;
        }
      
        & .${classes.select}{
          font-family: 'IBM Plex Sans', sans-serif;
          padding: 2px 0 2px 4px;
          border: 1px solid grey;
          border-radius: 6px; 
          background-color: transparent;
          color: black;
          transition: all 100ms ease;
      
          &:hover {
            // background-color: grey;
            cursor:pointer;
            border-color: grey;
          }
      
          &:focus {
            outline: 1px solid grey;
            border-color: grey;
          }
        }
      
        & .${classes.displayedRows} {
          margin: 0;
      
          @media (min-width: 768px) {
            margin-left: auto;
          }
        }
      
        & .${classes.actions} {
          display: flex;
          gap: 6px;
          border: transparent;
          text-align: center;
        }
      
        & .${classes.actions} > button {
          display: flex;
          align-items: center;
          padding: 0;
          border: transparent;
          border-radius: 50%;
          background-color: transparent;
          border: 1px solid grey;
          color: black;
          transition: all 120ms ease;
      
          > svg {
            font-size: 22px;
          }
      
          &:hover {
            background-color: grey;
            cursor:pointer;
            border-color: grey;
          }
      
          &:focus {
            outline: 3px solid grey;
            border-color: blue;
          }
      
          &:disabled {
            opacity: 0.3;
            &:hover {
              border: 1px solid grey;
              background-color: transparent;
            }
          }
        }
        `,
    );
      

    React.useEffect(() => {
        const handleShowListings = async () => {
            try{ 
              setShowListingsError(false);
              const res = await fetch(`/api/user/listings/${currentUser._id}`);
              const data = await res.json();
              if(data.success === false){
                setShowListingsError(true);
                return;
              }
        
              setUserListings(data);
            } catch(error){
              setShowListingsError(true);
            }
          }
          handleShowListings();

        // 
    }, [currentUser._id]);

    const handleListingDelete = async(listingID) => {
        try {
            const userData = await fetch(`/api/user/listings/${currentUser._id}`);
            const userDataJson = await userData.json();
            const storage = getStorage();

            const listingData = await fetch(`/api/listing/get/${listingID}`);
            const listingDataJson = await listingData.json();
            console.log("listingDataJson:",listingDataJson)
            for(let i=0;i<listingDataJson.imageUrls.length;i++){
                console.log('listingDataJson images:', listingDataJson.imageUrls.at(i));
                const name = userDataJson[0].imageUrls.at(i);
                const desertRef = ref(storage, name);
                deleteObject(desertRef).then(() => {
                    console.log("Image Removed Successfully")
                }).catch((error) => {
                    console.log(error)
                });
            }

            const res = await fetch(`/api/listing/delete/${listingID}`, {
                method:'DELETE'
            });

            const data = await res.json();
            if(data.success === false) {
                console.log(data.message);
                return;
            }
            setUserListings( 
                (prev) => prev.filter((listing) => listing._id !== listingID)
            );

        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        userListings.length > 0 ? (
            <div className='p-3 max-w-fit mx-auto'>
                <h1 className='text-3xl font-semibold text-center my-7'>
                    My Listings
                </h1>
                <p className='text-red-700 mt-5'>
                    {showListingsError ? 'Error showing listings!' : ''}
                </p>
                <table className='my-7'>
                    <thead>
                        <tr className='border p-3 flex items-center gap-4'>
                            {/* <th className='w-10'>
                                Sr No.
                            </th> */}
                            <th className='w-20'>
                                Image
                            </th>
                            <th>
                                Title
                            </th>
                            <th>

                            </th>
                        </tr>
                    </thead>
                    {
                    (rowsPerPage > 0 ? userListings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : userListings).map((listing, index) =>(
                    <tbody>
                        <tr key={listing._id} className='border p-3 flex items-center gap-4 hover:bg-gray-50'>
                            {/* <td className='w-10 items-center flex flex-col'>
                                {(index+1).toString()}
                            </td> */}
                            <td className='w-20'>
                                <Link to={`/listing/${listing._id}`}>
                                    <img src={listing.imageUrls[0]} alt='Listing Cover Image' className='h-20 w-20 object-contain rounded-lg'/>
                                </Link>
                            </td>
                            <td className='w-100'>
                                <Link className='flex-1 text-slate-700 font-semibold hover:underline truncate' to={`/listing/${listing._id}`}>
                                    <p className='w-[240px] sm:w-[400px] truncate'>
                                        {listing.name}
                                    </p>
                                </Link>
                            </td>
                            <td className='flex flex-col item-center'>
                                <button onClick={() => handleListingDelete(listing._id)} className='text-red-700 uppercase'>
                                    Delete
                                </button>
                                <Link to={`/update-listing/${listing._id}`}>
                                    <button className='text-green-700 uppercase'>
                                        Edit
                                    </button>
                                </Link>
                            </td>
                        </tr>
                    </tbody>
                    ))
                    }
                    <tfoot>
                        <tr>
                            <CustomTablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colSpan={3}
                            count={userListings.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            slotProps={{
                                select: {
                                'aria-label': 'rows per page',
                                },
                                actions: {
                                showFirstButton: true,
                                showLastButton: true,
                                slots: {
                                    firstPageIcon: FirstPageRoundedIcon,
                                    lastPageIcon: LastPageRoundedIcon,
                                    nextPageIcon: ChevronRightRoundedIcon,
                                    backPageIcon: ChevronLeftRoundedIcon,
                                },
                                },
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </tr>
                    </tfoot>
                </table>
            </div>
        ) : 
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>You have no listings!</h1>
            <Link to='/create-listing'>
                <h2 className='text-2xl font-semibold text-center my-7 underline text-slate-600'>Click here to create a new listing</h2>
            </Link>
        </div>
    )
}

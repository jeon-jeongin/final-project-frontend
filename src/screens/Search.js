import { gql, useLazyQuery } from "@apollo/client";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import Input from "../components/auth/Input";
import PageTitle from "../components/PageTitle";
import DetailModal from "../components/search/DetailModal";

function Search() {
    const { register, handleSubmit } = useForm();

    const onCompleted = ({ searchPhotos }) => {
        if (Object.keys(searchPhotos).length === 0) {
            alert("검색된 결과가 없습니다. 다시 검색을 해주세요.");
        }
    };

    const [startQueryFn, { data }] = useLazyQuery(SEARCH_PHOTOS, { onCompleted });
    const onSubmitValid = ({ keyword }) => {
        startQueryFn({
            variables: {
                keyword
            }
        })
    };

    const [modalOn, setModalOn] = useState(false);
    const openModal = () => {
        setModalOn(true);
    }
    const closeModal = () => {
        setModalOn(false);
    }

    const [searchId, setSearchId] = useState("");

    const onCheckedhandler = (e) => {
        e.preventDefault();
        setSearchId(e.target.getAttribute("value"));
        openModal()
    }

    return (
        <SearchContainer>
            <PageTitle title="Search" />
            <SearchBox>
                <form onSubmit={handleSubmit(onSubmitValid)} >
                    <SearchInput
                        ref={register({
                            required: true,
                        })}
                        name="keyword"
                        type="text"
                        placeholder="Search photos"
                    />
                    <Button>
                        <FontAwesomeIcon icon={faSearch} />
                    </Button>
                </form >
            </SearchBox >
            <Grid>
                {data?.searchPhotos?.map((photo) => (
                    <Photo key={photo.id} bg={photo.file} onClick={(e) => onCheckedhandler(e)} value={photo.id} />
                ))}
                {modalOn && <DetailModal closeModal={closeModal} searchId={searchId} />}
            </Grid>
        </SearchContainer>

    )
}

export default Search;

const SEARCH_PHOTOS = gql`
    query searchPhotos( $keyword: String!) {
        searchPhotos(keyword: $keyword){
            id
            file
        }
    }
`;

const SearchContainer = styled.div``;

const SearchBox = styled.div`
    max-width: 700px;
    margin: 0 auto;
    border-radius: 3px;
    border: 1px solid ${(props) => props.theme.borderColor};
`;

const SearchInput = styled(Input)`
    max-width: 670px;
    border: none;
    margin-top: 0px;
`;


const Button = styled.button`
    background-color: inherit;
    border: none;
    svg{
        font-size: 15px;
        color: ${(props) => props.theme.fontColor};
    }
`;

const Grid = styled.div`
  display: grid;
  grid-auto-rows: 290px;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 50px;
`;

const Photo = styled.div`
  background-image: url(${(props) => props.bg});
  background-size: cover;
  position: relative;
`;

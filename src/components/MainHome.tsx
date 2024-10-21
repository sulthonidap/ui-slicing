"use client";

import {
  Avatar,
  Box,
  Flex,
  HStack,
  SimpleGrid,
  Text,
  Skeleton,
  Textarea,
  Button,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import {
  AiOutlineComment,
  AiOutlineLike,
  AiOutlineRetweet,
} from "react-icons/ai";
import { PiTelegramLogo } from "react-icons/pi";

interface PostApi {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  mind: string;
  picture: string;
  status: number;
}

const MainHome = () => {
  const [posts, setPosts] = useState<PostApi[]>([]);
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null); // State for loading timeout
  const toast = useToast({
    position: "top",
    variant: "subtle",
    duration: 3000,
  });

  // Fetch posts from the API
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/list/post`
      );
      setPosts(res.data.data || []);
    } catch (err) {
      console.error("Error fetching post", err);
      toast({
        title: "Error fetching posts",
        description: "Could not load posts. Please try again later.",
        status: "error",
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      mind: "",
    },
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      setIsLoading(true); // Start loading

      // Set a loading timeout for 5 seconds (5000 ms)
      const timeout = setTimeout(() => {
        setIsLoading(false); // Stop loading after 5 seconds
      }, 5000);
      setLoadingTimeout(timeout);

      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/create/post`, values)
        .then((res) => {
          // Fetch the updated posts after successful post creation
          fetchData().finally(() => {
            clearTimeout(timeout); // Clear the timeout if the request completes before it fires
            setIsLoading(false); // Stop loading
            setLoadingTimeout(null);
          });
          setSubmitting(false);
          // Show success toast
          toast({
            description: "Your post has been successfully created!",
            status: "success",
            isClosable: true,
            duration: 2000,
          });
          // Optionally, you can reset the form after posting
          formik.resetForm();
        })
        .catch((err) => {
          console.error("Error creating post", err);
          setSubmitting(false);
          clearTimeout(timeout); // Clear the timeout on error
          setIsLoading(false); // Stop loading on error
          // Show error toast
          toast({
            title: "Error creating post.",
            description: "Could not create your post. Please try again.",
            status: "error",
            isClosable: true,
          });
        });
    },
  });

  return (
    <Box px={48} w={"100%"} pb={10}>
      <HStack spacing="24px" alignItems={"flex-start"}>
        <Box w="250px" h="300"  borderRadius="lg">
          <Box h="200px" bg="white" mb={4}></Box>
          <Box h='80px' bg="white"></Box>
        </Box>
        <Box w="700px" h="fit-content">
          <form onSubmit={formik.handleSubmit}>
            <Box
              bg={"white"}
              h={"fit-content"}
              padding={2}
              gap={2}
              borderWidth="1px"
              borderRadius="lg"
              mb={4}
            >
              <Flex gap={2} mt={2}>
                <Avatar bg="gray.500" />
                <Textarea
                  placeholder="Tulis komentar..."
                  value={formik.values.mind}  // Bind value to formik
                  onChange={formik.handleChange}  // Handle change with formik
                  name="mind"  // Name field to match formik initialValues
                />
              </Flex>
              <Box mt={2} display={"flex"} gap={2} justifyContent={"flex-end"}>
                <Button colorScheme="blue" h={8} w={20} type="submit">
                  Post
                </Button>
              </Box>
            </Box>
          </form>

          {/* Show skeleton loading while new post is being created */}
          {isLoading && <Skeleton height="100px" />}

          {posts
            .slice()
            .sort((a, b) => (a.ID < b.ID ? 1 : -1))
            .map((item) => (
              <Box
                key={item.ID}
                bg={"white"}
                h={"fit-content"}
                padding={2}
                gap={2}
                borderWidth="1px"
                borderRadius="lg"
                mb={4}
              >
                <Box display={"flex"} gap={2}>
                  <Avatar bg="gray.500" />
                  <Box display={"flex"} flexDir={"column"} justifyContent={"left"}>
                    <Text fontSize={"md"}>Adi</Text>
                    <Text fontSize={"sm"}>Software Engineer</Text>
                  </Box>
                </Box>
                <Text mt={2} ml={2}>
                  {item.mind}
                </Text>
                <SimpleGrid
                  columns={4}
                  spacing={10}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box
                    height="40px"
                    display={"flex"}
                    gap={2}
                    alignItems="center"
                    justifyContent="center"
                    _hover={{ bg: "gray.300" }}
                  >
                    <AiOutlineLike />
                    <Text fontSize={"sm"}>Like</Text>
                  </Box>
                  <Box
                    height="40px"
                    display={"flex"}
                    gap={2}
                    alignItems="center"
                    justifyContent="center"
                    _hover={{ bg: "gray.300" }}
                  >
                    <AiOutlineComment />
                    <Text fontSize={"sm"}>Comment</Text>
                  </Box>
                  <Box
                    height="40px"
                    display={"flex"}
                    gap={2}
                    alignItems="center"
                    justifyContent="center"
                    _hover={{ bg: "gray.300" }}
                  >
                    <AiOutlineRetweet />
                    <Text fontSize={"sm"}>Share</Text>
                  </Box>
                  <Box
                    height="40px"
                    display={"flex"}
                    gap={2}
                    alignItems="center"
                    justifyContent="center"
                    _hover={{ bg: "gray.300" }}
                  >
                    <PiTelegramLogo />
                    <Text fontSize={"sm"}>Kirim</Text>
                  </Box>
                </SimpleGrid>
              </Box>
            ))}

        </Box>
        <Box w="300px" h="650" bg="white" borderRadius="lg">
        </Box>
      </HStack>
    </Box>
  );
};

export default MainHome;

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProjects } from '../queries';
import { client, urlFor } from '../client';

// Mock the Sanity client and urlFor helper
vi.mock('../client', () => {
  const mockUrlFor = vi.fn().mockImplementation(() => ({
    auto: vi.fn().mockReturnThis(),
    url: vi.fn().mockReturnValue('https://mocked-url.com/image.jpg'),
  }));

  const mockClient = {
    fetch: vi.fn(),
  };

  return {
    client: mockClient,
    urlFor: mockUrlFor,
  };
});

describe('getProjects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch raw projects and transform them correctly', async () => {
    const mockRawProjects = [
      {
        _id: 'proj1',
        slug: 'project-one',
        id: 1,
        letter: 'A',
        title: 'Project One',
        subtitle: 'Sub One',
        description: 'Desc One',
        year: '2025',
        category: 'Architecture',
        location: 'Location One',
        coverImage: { asset: { _ref: 'image-ref-1' } },
        images: [{ asset: { _ref: 'image-ref-2' } }],
      },
    ];

    // Mock client.fetch to resolve with raw projects
    vi.mocked(client.fetch).mockResolvedValue(mockRawProjects);

    const projects = await getProjects();

    expect(client.fetch).toHaveBeenCalledTimes(1);
    expect(urlFor).toHaveBeenCalledTimes(2); // 1 for coverImage, 1 for gallery image

    expect(projects).toEqual([
      {
        sanityId: 'proj1',
        id: 1,
        slug: 'project-one',
        letter: 'A',
        title: 'Project One',
        subtitle: 'Sub One',
        description: 'Desc One',
        year: '2025',
        category: 'Architecture',
        location: 'Location One',
        coverImage: 'https://mocked-url.com/image.jpg',
        images: ['https://mocked-url.com/image.jpg'],
      },
    ]);
  });

  it('should fallback gracefully to defaults for missing fields', async () => {
    const mockRawProjects = [
      {
        _id: 'proj2',
        slug: null,
        id: null,
        letter: null,
        title: 'Project Two',
        subtitle: null,
        description: null,
        year: null,
        category: null,
        location: null,
        coverImage: null,
        images: null,
      },
    ];

    vi.mocked(client.fetch).mockResolvedValue(mockRawProjects);

    const projects = await getProjects();

    expect(projects[0]).toEqual({
      sanityId: 'proj2',
      id: 0,
      slug: 'project-two', // generated fallback from title
      letter: '',
      title: 'Project Two',
      subtitle: '',
      description: '',
      year: '',
      category: '',
      location: '',
      coverImage: '',
      images: [],
    });
  });

  it('should return an empty array and handle errors gracefully on fetch failure', async () => {
    vi.mocked(client.fetch).mockRejectedValue(new Error('Sanity API connection failed'));

    const projects = await getProjects();

    expect(projects).toEqual([]);
  });
});

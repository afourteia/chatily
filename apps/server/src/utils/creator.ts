import { ServerError } from '~/utils/error';
export const getCreatorObject = (id?: string | null) => {
  if (!id) {
    throw new ServerError({
      message: 'Request ProductionEvent not authenticated',
      code: 'UNAUTHORIZED',
    });
  }

  return {
    creator: {
      connect: {
        id: id,
      },
    },
    updater: {
      connect: {
        id: id,
      },
    },
  } as const;
};

export const getUpdaterObject = (id?: string | null) => {
  if (!id) {
    throw new ServerError({
      message: 'Request ProductionEvent not authenticated',
      code: 'UNAUTHORIZED',
    });
  }

  return {
    updater: {
      connect: {
        id: id,
      },
    },
  } as const;
};

export const getCreatorId = (id?: string | null) => {
  if (!id) {
    throw new ServerError({
      message: 'Request ProductionEvent not authenticated',
      code: 'UNAUTHORIZED',
    });
  }

  return {
    creatorId: id,
    updaterId: id,
  } as const;
};

export const getUpdaterId = (id?: string | null) => {
  if (!id) {
    throw new ServerError({
      message: 'Request ProductionEvent not authenticated',
      code: 'UNAUTHORIZED',
    });
  }

  return {
    updaterId: id,
  } as const;
};
